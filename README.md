# maven-repo-version-worker
A [Cloudflare Worker](https://workers.cloudflare.com/) which reads the latest version of an artifact from [Maven Central](https://search.maven.org) and returns it as plain text.

## Usage

https://maven-repo-version-worker.nycode.workers.dev/?group=GROUP&module=MODULE
