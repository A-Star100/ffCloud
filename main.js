const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const os = require('os');


const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.post('/run-ffmpeg', (req, res) => {
  const argsString = req.body.args;
  if (typeof argsString !== 'string' || argsString.trim() === '') {
    return res.status(400).send('No command provided');
  }

  // Parse args (improve if needed)
  const args = argsString.match(/(?:[^\s"]+|"[^"]*")+/g).map(arg => arg.replace(/"/g, ''));

  // Get home directory path
  const homeDir = os.homedir();

  // Spawn FFmpeg with working directory set to homeDir
const ffmpeg = spawn('ffmpeg', args, { cwd: homeDir });

  res.setHeader('Content-Type', 'text/plain');

  ffmpeg.stdout.on('data', data => res.write(data));
  ffmpeg.stderr.on('data', data => res.write(data)); // FFmpeg progress/info on stderr
  ffmpeg.on('close', code => res.end(`\nFFmpeg exited with code ${code}\n`));
});


app.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});
