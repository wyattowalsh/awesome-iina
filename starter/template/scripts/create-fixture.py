"""Write a deterministic, quiet, first-party 1-second WAV fixture. No playback occurs."""
from __future__ import annotations
import argparse,struct,wave
from pathlib import Path

def create(path:Path)->None:
    if path.exists():raise FileExistsError('Refusing to replace an existing fixture')
    path.parent.mkdir(parents=True,exist_ok=True)
    with path.open('xb') as output:
        with wave.open(output,'wb') as wav:
            wav.setnchannels(1);wav.setsampwidth(2);wav.setframerate(16000)
            # Integer triangular wave avoids platform-specific trigonometric rounding.
            samples=[((i % 80 if i % 80 < 40 else 80 - i % 80) * 80 - 1600) for i in range(16000)]
            wav.writeframes(b''.join(struct.pack('<h',value) for value in samples))
if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('output',nargs='?',type=Path,default=Path('reports/fixtures/tone.wav'))
    args=parser.parse_args();create(args.output);print(args.output)
