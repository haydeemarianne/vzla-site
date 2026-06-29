<?php
namespace App\Services;

use App\Models\MissingChild;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class DuplicateDetectionService
{
    public function checkMissingChild(MissingChild $child): array
    {
        $existing = MissingChild::where('id', '!=', $child->id)
            ->where('status', 'missing')
            ->where('validation_status', '!=', 'rejected')
            ->where(function ($q) use ($child) {
                $q->where('zone', 'like', '%' . explode(' ', $child->zone)[0] . '%')
                  ->orWhere('age', $child->age);
            })
            ->limit(20)
            ->get(['id', 'name', 'age', 'zone', 'description']);

        if ($existing->isEmpty()) {
            return ['score' => 0, 'id' => null];
        }

        $best = ['score' => 0, 'id' => null];
        foreach ($existing as $candidate) {
            $score = $this->fuzzyScore($child, $candidate);
            if ($score > $best['score']) {
                $best = ['score' => $score, 'id' => $candidate->id];
            }
        }

        if ($best['score'] >= 50 && $best['score'] < 80) {
            $aiScore = $this->askGroq($child, $existing->firstWhere('id', $best['id']));
            if ($aiScore !== null) {
                $best['score'] = $aiScore;
            }
        }

        return $best;
    }

    private function fuzzyScore(MissingChild $a, MissingChild $b): int
    {
        $score = 0;
        $nameSimilarity = 0;
        similar_text(strtolower($a->name), strtolower($b->name), $nameSimilarity);
        $score += (int)($nameSimilarity * 0.6);

        if ($a->age && $b->age && abs($a->age - $b->age) <= 1) {
            $score += 20;
        }

        $zoneSimilarity = 0;
        similar_text(strtolower($a->zone), strtolower($b->zone), $zoneSimilarity);
        $score += (int)($zoneSimilarity * 0.2);

        return min($score, 100);
    }

    private function askGroq(MissingChild $child, ?MissingChild $candidate): ?int
    {
        if (!$candidate || !config('services.groq.key')) {
            return null;
        }
        try {
            $prompt = "Determina si estos dos reportes de ninos desaparecidos describen a la MISMA persona. Responde SOLO con un numero del 0 al 100.\n\nReporte A: Nombre: {$child->name}, Edad: {$child->age}, Zona: {$child->zone}, Descripcion: {$child->description}\n\nReporte B: Nombre: {$candidate->name}, Edad: {$candidate->age}, Zona: {$candidate->zone}, Descripcion: {$candidate->description}\n\nSolo el numero:";

            $response = Http::withToken(config('services.groq.key'))
                ->timeout(8)
                ->post('https://api.groq.com/openai/v1/chat/completions', [
                    'model'       => 'llama-3.3-70b-versatile',
                    'messages'    => [['role' => 'user', 'content' => $prompt]],
                    'max_tokens'  => 5,
                    'temperature' => 0,
                ]);

            $text = trim($response->json('choices.0.message.content') ?? '');
            $number = (int)preg_replace('/[^0-9]/', '', $text);
            return ($number >= 0 && $number <= 100) ? $number : null;
        } catch (\Exception $e) {
            Log::warning('Groq duplicate check failed: ' . $e->getMessage());
            return null;
        }
    }
}
