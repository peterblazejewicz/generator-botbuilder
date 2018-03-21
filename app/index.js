const Generator = require('yeoman-generator');
const chalk = require('chalk');
const klawSync = require('klaw-sync');
const path = require('path');
const fse = require('fs-extra');
const kebabcase = require('kebab-case');

module.exports = class extends Generator {

  /**
   * @property {*} answers
   */

  constructor(args, opts) {
    super(args, opts);

    this.option('javascript', {
      desc: 'Generate JavaScript scaffolding'
    });

    this.option('typescript', {
      desc: 'Generate TypeScript scaffolding'
    });
  }

  async promptUser() {
    this.log(chalk.bold.cyan('Thank you for choosing Microsoft\'s Bot Framework!\nLet\'s get you started.'));
    // Common
    const answers = await this.prompt([
      {name: 'botName', message: 'What\'s the name of your bot?', default: 'sample'},
      {name: 'description', message: 'What will your bot do?', default: 'sample'},
      {
        type: 'list',
        name: 'version',
        message: 'Which version of the Bot Framework would you like to use?',
        default: 'v4',
        choices: ['v3', 'v4']
      }
    ]);
    // V3 decision flow
    if (answers.version === 'v3') {
      const {dialog} = await this.prompt([{
        name: 'dialog',
        type: 'list',
        message: 'What default dialog do you want?',
        choices: ['QnA Maker', 'LUIS', 'Echo']
      }]);
      Object.assign(answers, {dialog});
    }
    this.log(chalk.bold.cyan('Looks Good! Thank you.'));
    this.answers = answers;
  }

  writing() {
    this.log(chalk.bold.cyan('Writing configuration files'));
    const templateDir = this.templatePath();
    const templateOptions = this._buildTemplateOptions();
    // Common files
    const commonDir = path.join(templateDir, 'common');
    let filePaths = klawSync(commonDir, {nodir: true});

    filePaths.forEach(filePath => {
      let {base, dir} = path.parse(filePath.path);
      const relativePath = dir.replace(commonDir, '').replace('\\', '');
      const location = path.join(relativePath, base);
      if (base.startsWith('_')) {
        base = base.replace('_', '.');
      }
      const destination = path.join(relativePath, base);
      this.fs.copyTpl(this.templatePath('common/' + location), this.destinationPath(destination), templateOptions);
    });

    const {version} = this.answers;
    return version === 'v3' ? this._writeV3() : this._writeV4();
  }

  installingDependencies() {
    if (this.answers.language === 'TypeScript') {
      this.log(chalk.bold.cyan('Installing TypeScript dependencies'));
      this.npmInstall(['@types/restify', '@types/node', 'typescript'], {save: true})
        .then(() => {
          this.log(chalk.bold.cyan('Done...'));
        });
    }
    this.log(chalk.bold.cyan('Installing packages'));
    this.installDependencies({npm: true, bower: false, yarn: false}).then(() => {
      this.log(chalk.bold.cyan('Done...'));
    });
  }

  _buildTemplateOptions() {
    const {answers} = this;
    const {language, version} = answers;

    const extension = answers.language === 'JavaScript' ? 'js' : 'ts';
    const launchSteps = extension === 'js' ? 'node app.js' : 'tsc && node app.js';
    const botBuilderVersion = version === 'v3' ? '3.14.0' : '^4.0.0-m2.1';
    const main = language === 'TypeScript' ? 'lib/app.js' : 'app.js';
    const build = language === 'TypeScript' ? 'tsc' : 'echo "no build is required"';
    const luisRegistration = answers.dialog === 'LUIS' ? '\nbot.recognizer(new builder.LuisRecognizer(process.env.LUIS_MODEL_URL));\n' : '\n';

    return Object.assign({
      extension,
      launchSteps,
      botBuilderVersion,
      main,
      build,
      luisRegistration,
      dialog: false
    }, answers);
  }

  _writeV3() {
    const templateOptions = this._buildTemplateOptions();
    const {botName, extension} = templateOptions;
    const directoryName = kebabcase(botName);

    if (path.basename(this.destinationPath()) !== directoryName) {
      this.log(`Your bot should be in a directory named ${directoryName}\nI'll automatically create this folder.`);
      fse.ensureDirSync(directoryName);
      this.destinationRoot(this.destinationPath(directoryName));
    }
    const app = `v3/app.${extension}`;
    const bot = `v3/bot.${extension}`;
    this.fs.copy(this.templatePath(app), this.destinationPath(app));
    this.fs.copyTpl(this.templatePath(bot), this.destinationPath(bot), templateOptions);
    this.fs.copyTpl(this.templatePath(`v3/dialogs-${extension}`), this.destinationPath('dialogs'), templateOptions);
  }

  _writeV4() {
    const templateDir = this.templatePath();
    const templateOptions = this._buildTemplateOptions();
    const {language} = templateOptions;
    const languageDir = language === 'TypeScript' ? 'v4/echobot-typescript' : 'v4/echobot-javascript';
    const sourceRoot = language === 'TypeScript' ? 'src' : 'lib';

    const filePaths = klawSync(path.join(templateDir, languageDir), {nodir: true});
    filePaths.forEach(filePath => {
      let {base} = path.parse(filePath.path);
      let destination = base.startsWith('tsconfig') ? '' : sourceRoot;
      this.fs.copyTpl(this.templatePath(path.join(languageDir, base)), this.destinationPath(path.join(destination, base)), templateOptions);
    });
  }
};
