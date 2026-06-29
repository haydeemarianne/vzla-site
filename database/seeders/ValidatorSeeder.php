<?php

namespace Database\Seeders;

use App\Models\Validator;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ValidatorSeeder extends Seeder
{
    public function run(): void
    {
        // Solo crea si no existe ya un validator con este email
        Validator::firstOrCreate(
            ['email' => 'hmcr1912@gmail.com'],
            [
                'name'    => 'Marianne Cedeño',
                'token'   => Str::random(64),
                'modules' => ['cases', 'engineers', 'zones', 'volunteers', 'children'],
                'active'  => true,
            ]
        );

        $validator = Validator::where('email', 'hmcr1912@gmail.com')->first();
        $this->command->info('');
        $this->command->info('=== PANEL DE VALIDADORES ===');
        $this->command->info('URL: https://vzla.site/validar/' . $validator->token);
        $this->command->info('============================');
        $this->command->info('');
    }
}
