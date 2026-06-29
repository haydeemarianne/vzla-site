<?php

namespace App\Http\Controllers;

use App\Models\PrintableMaterial;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class PrintableMaterialController extends Controller
{
    private const CATEGORIES_3D = [
        '3d_construction', '3d_ironwork', '3d_medical', '3d_furniture', '3d_tools', '3d_other',
    ];

    public function index(Request $request)
    {
        $is3d = $request->tab === '3d';

        $query = PrintableMaterial::where('validation_status', 'approved')
            ->where('is_3d', $is3d)
            ->when($request->category, fn($q) => $q->where('category', $request->category))
            ->latest();

        return Inertia::render('Materiales/Index', [
            'materials' => $query->paginate(20)->withQueryString(),
            'filters'   => $request->only(['category', 'tab']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Materiales/Subir');
    }

    public function store(Request $request)
    {
        $is3d = in_array($request->category, self::CATEGORIES_3D);

        $request->validate([
            'title'                 => 'required|string|max:200',
            'description'           => 'nullable|string|max:500',
            'file'                  => $is3d
                ? 'required|file|mimes:stl,obj,gcode,zip|max:102400'
                : 'required|file|mimes:pdf,jpg,jpeg,png,svg|max:20480',
            'category'              => 'required|string|max:100',
            'subcategory'           => 'nullable|string|max:100',
            'print_instructions'    => 'nullable|array',
            'uploaded_by'           => 'required|string|max:200',
            'organization'          => 'nullable|string|max:200',
            'contact'               => 'nullable|string|max:200',
            'contributor_instagram' => 'nullable|string|max:100',
            'contributor_phone'     => 'nullable|string|max:30',
        ]);

        $filePath = $request->file('file')->store('materials', 'public');
        $fileType = $request->file('file')->getClientOriginalExtension();

        PrintableMaterial::create([
            'title'                 => $request->title,
            'description'           => $request->description,
            'file_path'             => $filePath,
            'file_type'             => $fileType,
            'category'              => $request->category,
            'subcategory'           => $request->subcategory,
            'is_3d'                 => $is3d,
            'print_instructions'    => $request->print_instructions ?? [],
            'uploaded_by'           => $request->uploaded_by,
            'organization'          => $request->organization,
            'contact'               => $request->contact,
            'contributor_instagram' => $request->contributor_instagram,
            'contributor_phone'     => $request->contributor_phone,
        ]);

        return redirect('/materiales')->with('success', 'Archivo subido. Gracias por contribuir.');
    }

    public function download(PrintableMaterial $material)
    {
        abort_if($material->validation_status !== 'approved', 404);
        $material->incrementDownload();
        return Storage::disk('public')->download($material->file_path, $material->title . '.' . $material->file_type);
    }
}
