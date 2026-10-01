#!/usr/bin/env node
import{readFile,writeFile}from'node:fs/promises';
import{closedLoop,discretizeStateSpace,frequencyResponse,logarithmicFrequencies,monteCarloStability,pidController,reportMarkdown,rootLocus,stabilityAnalysis,stabilityMargins,stepMetrics,stepResponse,tfToStateSpace,tunePidFopdt}from'./index.js';
const args=process.argv.slice(2),[command,path]=args,option=name=>{const i=args.indexOf(`--${name}`);return i<0?undefined:args[i+1]},load=async file=>JSON.parse(await readFile(file,'utf8')),emit=async value=>{const output=`${JSON.stringify(value,null,2)}\n`;option('output')?await writeFile(option('output'),output):process.stdout.write(output)};
try{
  if(!command||command==='help')process.stdout.write('Usage: control-system-designer <analyze|margins|bode|step|close-loop|pid|tune-pid|discretize|root-locus|monte-carlo|report> input.json [options]\n');
  else if(command==='analyze')await emit(stabilityAnalysis(await load(path),{domain:option('domain')??'continuous'}));
  else if(command==='margins')await emit(stabilityMargins(await load(path),{start:Number(option('start')??1e-3),end:Number(option('end')??1e4),points:Number(option('points')??3000)}));
  else if(command==='bode')await emit(frequencyResponse(await load(path),logarithmicFrequencies(Number(option('start')??.01),Number(option('end')??100),Number(option('points')??100))));
  else if(command==='step'){const samples=stepResponse(await load(path),{duration:Number(option('duration')??10),step:Number(option('step')??.01)});await emit({metrics:stepMetrics(samples),samples})}
  else if(command==='close-loop'){const input=await load(path);await emit(closedLoop(input.forward,input.feedback,input.options))}
  else if(command==='pid')await emit(pidController(await load(path)));
  else if(command==='tune-pid')await emit(tunePidFopdt(await load(path)));
  else if(command==='discretize'){const system=await load(path);await emit(discretizeStateSpace(system.A?system:tfToStateSpace(system),Number(option('sample-time')??.01)))}
  else if(command==='root-locus'){const system=await load(path),gains=(option('gains')??'0,0.1,1,10,100').split(',').map(Number);await emit(rootLocus(system,gains))}
  else if(command==='monte-carlo')await emit(monteCarloStability(await load(path),{iterations:Number(option('iterations')??500),coefficientSigma:Number(option('sigma')??.02),seed:Number(option('seed')??42)}));
  else if(command==='report'){const markdown=reportMarkdown(await load(path));option('output')?await writeFile(option('output'),markdown):process.stdout.write(markdown)}
  else throw new Error('unknown command');
}catch(error){process.stderr.write(`control-system-designer: ${error.message}\n`);process.exitCode=1}
