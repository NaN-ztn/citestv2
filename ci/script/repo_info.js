const execSync = require('child_process').execSync
const version = require('../../package.json').version

/**
 * 获取当前Git分支信息
 * @returns repoInfo
 */
async function repoInfo() {
  return {
    gitBranchName: execSync('git show -s --format=%d').toString().trim(),
    gitCommitHash: execSync('git show -s --format=%h').toString().trim(),
    gitCommitDate: execSync('git show -s --format=%cd').toString().trim(),
    gitCommitName: execSync('git show -s --format=%s').toString().trim(),
    version: version,
  }
}
module.exports = repoInfo
