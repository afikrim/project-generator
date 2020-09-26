const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');

const inquirer = require('inquirer');

const CURR_DIR = process.cwd();

const TEMPLATES = fs.readdirSync(path.join(__dirname, 'templates'));
const QUESTIONS = [
        {
            name: 'project-choice',
            type: 'list',
            message: 'What project templates that you want to use?',
            choices: TEMPLATES,
        },
        {
            name: 'project-name',
            type: 'input',
            message: 'Project name: ',
            validate: (input) => {
                if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
                else return 'Project name may only include letters, numbers, underscores and hashes.';
            },
        },
        {
            name: 'project-description',
            type: 'input',
            message: 'Project description: ',
            default: '',
        },
        {
            name: 'project-version',
            type: 'input',
            message: 'Project version: ',
            default: '0.0.0',
            validate: (input) => {
                if (/^(\d+\.)?(\d+\.)?(\*|\d+)$/.test(input)) return true;
                else return 'Project version must use x.x.x pattern';
            },
        },
        {
            name: 'project-repository',
            type: 'input',
            message: 'Project repository: ',
            default: '',
        },
        {
            name: 'project-package-manager',
            type: 'list',
            message: 'What package manager you want to use?',
            choices: ['npm', 'yarn'],
            default: 'npm',
        },
    ]

const createDirectoryContents = (templatePath, projectPath) => {
    const fileToCreate = fs.readdirSync(templatePath);

    fileToCreate.map((filePath) => {
        const originFilePath = path.join(templatePath, filePath);

        const stats = fs.statSync(originFilePath);

        if (stats.isFile()) {
            const content = fs.readFileSync(originFilePath);

            if (filePath === '.env.example') filePath = '.env';

            const writePath = path.join(projectPath, filePath);
            fs.writeFileSync(writePath, content, 'utf-8');
        } else if (stats.isDirectory()) {
            const childTemplatePath = path.join(templatePath, filePath);
            const childProjectPath = path.join(projectPath, filePath);

            fs.mkdirSync(childProjectPath);

            createDirectoryContents(childTemplatePath, childProjectPath);
        }
    })
}

const initProject = (projectName, projectDescription, projectVersion, projectRepository, projectPackageManager) => {
    const projectPath = path.join(CURR_DIR, projectName);
    const packageJsonPath = path.join(projectPath, 'package.json');
    const readmeMdPath = path.join(projectPath, 'README.md');

    let packageJson = fs.readFileSync(packageJsonPath, 'utf-8');
    let readmeMd = fs.readFileSync(readmeMdPath, 'utf-8');

    packageJson = packageJson.replace('{{ name }}', projectName.toLowerCase());
    packageJson = packageJson.replace('{{ description }}', projectDescription);
    packageJson = packageJson.replace('{{ version }}', projectVersion);

    readmeMd = readmeMd.replace('{{ name }}', projectName);
    readmeMd = readmeMd.replace('{{ description }}', projectDescription);

    fs.writeFileSync(packageJsonPath, packageJson, 'utf-8');
    fs.writeFileSync(readmeMdPath, readmeMd, 'utf-8');

    let commands = '';

    commands += 'git init;';
    commands += 'git add .gitignore README.md;';
    commands += 'git commit -m "Initial Commit";';

    if (projectRepository) commands += `git remote add origin ${projectRepository};`;

    if (projectPackageManager == 'npm') {
        commands += 'npm install;';
    } else if (projectPackageManager == 'yarn') {
        commands += 'yarn;';
    }

    childProcess.exec(commands, {cwd: projectPath}, (error, stdout, stderr) => {
        if (error) {
            console.error(`error: ${error}`);
            return;
        }
        if (stdout) console.log(stdout);
        if (stderr) console.log(stderr);
    })
}

inquirer.prompt(QUESTIONS)
    .then((answers) => {
        const projectChoice = answers['project-choice'];
        const projectName = answers['project-name'];
        const projectDescription = answers['project-description'];
        const projectVersion = answers['project-version'];
        const projectRepository = answers['project-repository'];
        const projectPackageManager = answers['project-package-manager'];

        const templatePath = path.join('templates', projectChoice);
        const projectPath = path.join(CURR_DIR, projectName);

        fs.mkdirSync(projectPath);

        createDirectoryContents(templatePath, projectPath);
        initProject(projectName, projectDescription, projectVersion, projectRepository, projectPackageManager);
    })
    .catch((err) => {
        console.log('An error occured!');
        console.error(err);
    })
