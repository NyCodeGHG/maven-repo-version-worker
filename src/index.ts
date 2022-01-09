import { parseString } from 'xml2js';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
  "Access-Control-Max-Age": "86400",
}

addEventListener('fetch', async (event) => {
  const url = new URL(event.request.url);
  const group = url.searchParams.get('group')?.replace('.', '/');
  const module = url.searchParams.get('module')?.replace('.', '/');
  if (!group || !module) {
    const exampleUrl = `${url.origin}/?group=dev.kord&module=kord-core`;
    event.respondWith(new Response('<p>Provide maven group and module in the url parameters.</p>' +
      `Example: <a href="${exampleUrl}">${exampleUrl}</a>`, {
      status: 400,
      headers: {
        'Content-Type': 'text/html',
        ...corsHeaders
      }
    }));
    return;
  }
  event.respondWith(handle(event, group, module));
});

async function handle(event: FetchEvent, group: string, module: string): Promise<Response> {
  const mavenMetadataUrl = `https://repo1.maven.org/maven2/${group}/${module}/maven-metadata.xml`;
  const response = await fetch(mavenMetadataUrl, {});

  if (response.status != 200) {
    // Maven Artifact does not exist.
    return new Response(`${group}/${module} does not exist!`, {
      status: 400,
      headers: corsHeaders
    });
  }
  const xml = await response.text();
  const metadata: any = await xml2js(xml);
  return new Response(metadata.metadata.versioning[0].latest[0], {
    headers: corsHeaders
  });
}

function xml2js(xml: string): Promise<string> {
  return new Promise((resolve, reject) => {
    parseString(xml, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}
