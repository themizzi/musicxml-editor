import { Then, When } from '@wdio/cucumber-framework'
import { browser } from '@wdio/globals'
import assert from 'node:assert/strict'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

When('I open the app', async () => {
  const fileUrl = pathToFileURL(path.resolve(process.cwd(), 'dist/index.html')).href
  await browser.url(fileUrl)
})

Then('the page should successfully load', async () => {
  assert(await browser.execute(async () => document.readyState) === 'complete', 'Page did not load successfully');
})
