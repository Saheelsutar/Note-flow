import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const BASE_DIR = path.join(process.cwd(), 'public', 'uploads');

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get('file');
        const parentFolder = formData.get('parentFolder') || '';

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const filePath = path.join(BASE_DIR, parentFolder, file.name);
        const fileBuffer = await file.arrayBuffer();

        await fs.writeFile(filePath, Buffer.from(fileBuffer));

        return NextResponse.json({ message: 'File uploaded successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Error uploading file' }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const { filePath } = await req.json();
        const fullPath = path.join(BASE_DIR, filePath);

        await fs.unlink(fullPath);

        return NextResponse.json({ message: 'File deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting file' }, { status: 500 });
    }
}
