

import * as fs from 'fs/promises';
import * as path from 'path';

const mappings = [{
    'name': 'rounds',
    'path': '../../packages/kit/src/rounds/',
}
]

const importLocation = './src/allokit'

const skip = ["__tests__"]


async function run() {
    console.log('\n\n\n')
    console.log('welcome to the Allo Starter Kit')

    console.log("copying rounds...");
    await copyFiles(mappings[0]);
    console.log("... done copying rounds!");
}

async function copyFiles(mapping: { name: string, path: string }) {
    await fs.mkdir(`${importLocation}/${mapping.name}`, { recursive: true })
    const files = await fs.readdir(mapping.path)
    for (let j = 0; j < files.length; j++) {
        const file = files[j]
        const source = path.join(mapping.path, file)
        if (skip.includes(file)) {
            continue;
        }
        const destination = path.join(`${importLocation}`, mapping.name, file)        
        await fs.cp(source, destination, {recursive: true})
    }
}

run()