/**
 * Pre-start is where we want to place things that must run BEFORE the express
 * server is started. This is useful for environment variables, command-line
 * arguments, and cron-jobs.
 */

// NOTE: DO NOT IMPORT ANY SOURCE CODE HERE
import path from 'path'
import dotenv from 'dotenv'
import { parse } from 'ts-command-line-args'

// **** Types **** //

interface IArgs {
  env: string
}

// **** Setup **** //

// Command line arguments
const args = parse<IArgs>({
  env: {
    type: String,
    defaultValue: 'development',
    alias: 'e',
  },
})

// Set the env file
// eslint-disable-next-line node/no-process-env
if (!process.env.RENDER) {
  dotenv.config({
    path: path.join(__dirname, `../env/${args.env}.env`),
  })
}
