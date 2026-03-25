import argparse
import math
import random
import wave
from array import array
from pathlib import Path


def clamp_sample(value: int) -> int:
    return max(-32768, min(32767, value))


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Mix random white noise into a 16-bit PCM WAV file."
    )
    parser.add_argument("input", type=Path, help="Source WAV file")
    parser.add_argument("output", type=Path, help="Destination WAV file")
    parser.add_argument(
        "--noise-ratio",
        type=float,
        default=0.6,
        help="Noise RMS as a fraction of signal RMS (default: 0.6)",
    )
    parser.add_argument(
        "--seed",
        type=int,
        default=1337,
        help="Random seed for reproducible output (default: 1337)",
    )
    args = parser.parse_args()

    if args.noise_ratio < 0:
        raise SystemExit("--noise-ratio must be non-negative")

    with wave.open(str(args.input), "rb") as src:
        params = src.getparams()
        if params.sampwidth != 2:
            raise SystemExit("Only 16-bit PCM WAV files are supported")
        raw_frames = src.readframes(params.nframes)

    samples = array("h")
    samples.frombytes(raw_frames)

    if not samples:
        raise SystemExit("Input file contains no audio frames")

    signal_rms = math.sqrt(sum(sample * sample for sample in samples) / len(samples))
    noise_rms = signal_rms * args.noise_ratio
    rng = random.Random(args.seed)

    noised = array("h")
    for sample in samples:
        noise = int(round(rng.gauss(0, noise_rms)))
        noised.append(clamp_sample(sample + noise))

    with wave.open(str(args.output), "wb") as dst:
        dst.setparams(params)
        dst.writeframes(noised.tobytes())

    print(
        f"Wrote {args.output} with signal RMS {signal_rms:.2f} and noise RMS {noise_rms:.2f}"
    )


if __name__ == "__main__":
    main()
