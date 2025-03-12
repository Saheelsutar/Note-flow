import { promises as fs } from 'fs';
import path from 'path';

const BASE_DIR = path.join(process.cwd(), 'public', 'uploads');

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const folderPath = searchParams.get('folder') || '';

        const fullPath = path.join(BASE_DIR, folderPath);
        const files = await fs.readdir(fullPath, { withFileTypes: true });

        return Response.json({
            files: files.map(file => ({
                name: file.name,
                isFolder: file.isDirectory(),
            }))
        });
    } catch (error) {
        return Response.json({ error: 'Error fetching folders' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const { folderName, parentFolder } = await req.json();
        const newFolderPath = path.join(BASE_DIR, parentFolder, folderName);

        await fs.mkdir(newFolderPath, { recursive: true });

        return Response.json({ message: 'Folder created' });
    } catch (error) {
        return Response.json({ error: 'Error creating folder' }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const {currentFolder,folderName} = await req.json();
        if (!folderName) {
            return Response.json({ error: "Folder name is required" }, { status: 400 });
        }
        const folderPath = path.join(BASE_DIR, currentFolder,folderName)
        await fs.rm(folderPath, { recursive: true, force: true });

        return Response.json({ message: 'Folder deleted' });
    } catch (error) {
        return Response.json({ error: 'Error deleting folder' }, { status: 500 });
    }
}
