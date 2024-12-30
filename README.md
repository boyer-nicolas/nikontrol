# OSC Controller

## Getting Started

### DAW Setup

#### Reaper

- Go to reaper
- Go to preferences
- Click on "Control/OSC/Web"
- Click on "Add" and configure like so:

```shell
- Control Surface Mode: "OSC"
- Device Name: What you want
- Mode: "Configure Device IP+Local Port"
- Device Port: 9000
- Local Listen Port: 8000
- Allow binding messages to reaper actions and FX learn: on
```

You're good to go.

### App Setup

```shell
bun install
bun run dev
```

## CLI

```shell
Usage: bun run src/index.ts [command] [options]

An OSC-based controller for any DAW.

Options:
  -V, --version     output the version number
  -h, --help        display help for command

Commands:
  server            Start the server
  record            Start recording on the DAW
  play              Start playing on the DAW
  pause             Pause playback on the DAW
  stop              Stop playback on the DAW
  metronome <bool>  Toggle the metronome on or off
  repeat <bool>     Toggle repeat on or off
  bank [options]    Select a bank
  help [command]    display help for command
```

## Hardware Required

Coming soon (haven't received it yet)
