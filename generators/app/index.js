'use strict';

const path = require('path');
const Generator = require('yeoman-generator');
const _ = require('lodash');
const extend = require('deep-extend');
const mkdirp = require('mkdirp');

module.exports = class extends Generator {
  prompting() {
    const prompts = [
      { name: 'botName', message: `What 's the name of your bot?`, default: 'sample' },
      { name: 'description', message: 'What will your bot do?', default: 'sample' },
      { name: 'language', type: 'list', message: 'What language do you want to use?', choices: ['TypeScript', 'JavaScript'] },
    ];

    return this.prompt(prompts).then((props) => {
      this.props = props;
    });
  }
  writing() {
    const directoryName = _.kebabCase(this.props.botName);
    if (path.basename(this.destinationPath()) !== directoryName) {
      this.log(`Your bot should be in a directory named ${directoryName}\nI'll automatically create this folder.`);
      mkdirp(directoryName);
      this.destinationRoot(this.destinationPath(directoryName));
    }

    this.fs.copyTpl(this.templatePath('package.json'), this.destinationPath('package.json'), { botName: directoryName });
    this.fs.copy(this.templatePath('_gitignore'), this.destinationPath('.gitignore'));
    this.fs.copy(this.templatePath('_env'), this.destinationPath('.env'));

    const extension = this.props.language === 'JavaScript' ? 'js' : 'ts';

    this.fs.copy(this.templatePath(`app.${extension}`), this.destinationPath(`app.${extension}`));
    this.fs.copyTpl(this.templatePath(`bot.${extension}`), this.destinationPath(`bot.${extension}`), {
      botName: this.props.botName, description: this.props.description
    });

    if(extension === 'ts') {
      this.fs.copy(this.templatePath('tsconfig.json'), this.destinationPath('tsconfig.json'));
    }

    const launchSteps = extension === 'js' ? `node app.js` : `tsc\nnode app.js`;

    this.fs.copyTpl(this.templatePath('README.md'), this.destinationPath('README.md'), {
      botName: this.props.botName, description: this.props.description, launchSteps: launchSteps, extension: extension
    });
  }

  install() {
    this.installDependencies({bower: false});
  }
}