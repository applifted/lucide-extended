// The tests load the partial-compiled dist/, which Angular compiles at runtime (JIT),
// as it does for any library in a test run without the linker.
import '@angular/compiler'
import { getTestBed } from '@angular/core/testing'
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing'

getTestBed().initTestEnvironment(BrowserTestingModule, platformBrowserTesting())
