import axios from 'axios'
import { showConsoleLibraryError } from './general.util.js'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function checkUpdate(currentBotVersion : string){
    try {
        // Check if there are updates from GitHub repository
        const {stdout: currentBranch} = await execAsync('git rev-parse --abbrev-ref HEAD')
        const branch = currentBranch.trim()

        // Fetch latest changes from remote
        await execAsync('git fetch origin')

        // Check if local is behind remote
        const {stdout: statusOutput} = await execAsync(`git rev-list HEAD...origin/${branch} --count`)
        const commitsAhead = parseInt(statusOutput.trim())

        let response = {
            latest: commitsAhead === 0,
            commitsAhead
        }

        return response
    } catch (err){
        showConsoleLibraryError(err, 'checkUpdate')
        throw err
    }
}

export async function makeUpdate(){
    try {
        // Get current branch
        const {stdout: currentBranch} = await execAsync('git rev-parse --abbrev-ref HEAD')
        const branch = currentBranch.trim()

        // Pull latest changes
        console.log('🔄 Pulling latest changes from GitHub...')
        const {stdout: pullOutput} = await execAsync(`git pull origin ${branch}`)
        console.log(pullOutput)

        // Check if package.json was updated
        const {stdout: diffOutput} = await execAsync('git diff HEAD@{1} HEAD --name-only')
        const filesChanged = diffOutput.split('\n')

        if (filesChanged.includes('package.json') || filesChanged.includes('yarn.lock')) {
            console.log('📦 Installing dependencies...')
            await execAsync('yarn install')
        }

        // Rebuild project
        console.log('🔨 Building project...')
        await execAsync('yarn build')

        console.log('✅ Update completed successfully!')

        return true
    } catch(err){
        console.error('❌ Update failed:', err)
        throw err
    }
}