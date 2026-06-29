<?php

namespace App\Console\Commands;

use App\Models\Validator;
use Illuminate\Console\Command;

class CreateValidator extends Command
{
    protected $signature = 'validator:create {name} {email}';
    protected $description = 'Crea un validador con link privado de acceso';

    public function handle(): void
    {
        $token = Validator::generateToken();

        $validator = Validator::create([
            'name'    => $this->argument('name'),
            'email'   => $this->argument('email'),
            'token'   => $token,
            'modules' => ['children', 'engineers', 'zones'],
            'active'  => true,
        ]);

        $url = config('app.url') . '/validar/' . $token;

        $this->info('Validador creado correctamente.');
        $this->line('');
        $this->line('Nombre : ' . $validator->name);
        $this->line('Email  : ' . $validator->email);
        $this->line('');
        $this->warn('Link privado (comparte solo con el validador):');
        $this->line($url);
        $this->line('');
        $this->comment('Guarda este link — no se puede recuperar el token después.');
    }
}
