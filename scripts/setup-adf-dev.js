#!/usr/bin/env node

/**
 * ADF Local Development Environment Setup Script
 * This script sets up local ADF development by:
 * 1. Cloning ADF repository if not exists
 * 2. Building ADF libraries
 * 3. Creating npm links
 * 4. Linking ADF libraries to content app
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ADF_REPO_PATH = '../alfresco-ng2-components';
const ADF_REPO_URL = 'https://github.com/Alfresco/alfresco-ng2-components.git';

function runCommand(command, cwd = process.cwd()) {
  console.log(`Running: ${command} in ${cwd}`);
  try {
    execSync(command, { cwd, stdio: 'inherit' });
  } catch (error) {
    console.error(`Error running command: ${command}`);
    throw error;
  }
}

function setupADFLocalDev() {
  console.log('🚀 Setting up ADF Local Development Environment...');

  // Step 1: Clone ADF repository if it doesn't exist
  if (!fs.existsSync(ADF_REPO_PATH)) {
    console.log('📦 Cloning ADF repository...');
    runCommand(`git clone ${ADF_REPO_URL} ${ADF_REPO_PATH}`);

    // Checkout the version that matches your current ADF version
    console.log('🔄 Checking out compatible ADF version...');
    runCommand('git checkout develop', ADF_REPO_PATH); // or specific tag if available
  } else {
    console.log('✅ ADF repository already exists');
  }

  // Step 2: Install dependencies and build ADF
  console.log('🔧 Installing ADF dependencies...');
  runCommand('npm install', ADF_REPO_PATH);

  // Install missing dependencies that might cause resolution issues
  console.log('📦 Installing additional dependencies...');
  const additionalDeps = [
    'event-emitter',
    'buffer',
    '@types/event-emitter',
    'rxjs@7.8.2',
    'zone.js@0.15.0'
  ];

  additionalDeps.forEach(dep => {
    try {
      runCommand(`npm install ${dep}`, ADF_REPO_PATH);
      console.log(`✅ Installed ${dep}`);
    } catch (error) {
      console.warn(`⚠️  Failed to install ${dep}: ${error.message}`);
    }
  });

  console.log('🏗️  Building ADF libraries...');
  runCommand('npm run build:libs', ADF_REPO_PATH);

  // Step 3: Create npm links in ADF repository
  console.log('🔗 Creating npm links in ADF repository...');
  const libraries = ['adf-core', 'adf-content-services', 'adf-extensions', 'js-api'];

  libraries.forEach(lib => {
    const libPath = path.join(ADF_REPO_PATH, 'dist', lib);
    if (fs.existsSync(libPath)) {
      runCommand('npm link', libPath);
      console.log(`✅ Created link for ${lib}`);
    } else {
      console.warn(`⚠️  Library ${lib} not found at ${libPath}`);
    }
  });

  // Step 4: Link ADF libraries in content app
  console.log('🔗 Linking ADF libraries to content app...');
  const packages = [
    '@alfresco/adf-core',
    '@alfresco/adf-content-services',
    '@alfresco/adf-extensions',
    '@alfresco/js-api'
  ];

  packages.forEach(pkg => {
    try {
      runCommand(`npm link ${pkg}`);
      console.log(`✅ Linked ${pkg}`);
    } catch (error) {
      console.warn(`⚠️  Failed to link ${pkg}: ${error.message}`);
    }
  });

  console.log('🎉 ADF Local Development Environment setup complete!');
  console.log('');
  console.log('📝 Usage:');
  console.log('  npm run start:adf     - Start development with ADF watching');
  console.log('  npm run watch:adf     - Watch ADF changes only');
  console.log('  npm run rebuild:adf   - Rebuild ADF libraries');
  console.log('');
  console.log('🔧 To modify ADF components:');
  console.log(`  1. Edit files in ${ADF_REPO_PATH}/lib/`);
  console.log('  2. Changes will be automatically rebuilt and reflected');
}

if (require.main === module) {
  setupADFLocalDev();
}

module.exports = { setupADFLocalDev };
