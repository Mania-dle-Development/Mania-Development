import { useEffect, useState } from "react";

// how much of the track the shortest and longest bars fill (percent)
const MIN_FILL = 10;
const MAX_FILL = 90;
// used when every bucket has the same value and that value is not zero
const EQUAL_FILL = 50;

// delay between each bar starting its animation, and how long each takes
const STAGGER_MS = 50;
const DURATION_MS = 700;

// track = unfilled part of the bar, fill = the animated part
// full class names are written out so tailwind can find them
const TONES = {
	green: { track: "bg-secondary-green/60", fill: "bg-secondary-green" },
	yellow: { track: "bg-primary-yellow/60", fill: "bg-primary-yellow" },
	gray: { track: "bg-tile-empty", fill: "bg-[#99a0a7]" },
};

// 1 guess is green, 2 guesses is yellow, everything else is gray
const getTone = (guesses) =>
	guesses === 1 ? TONES.green : guesses === 2 ? TONES.yellow : TONES.gray;

// scales a bucket between MIN_FILL and MAX_FILL based on the other buckets
function getFillPercent(total, min, max) {
	if (max === 0) return MIN_FILL;
	if (max === min) return EQUAL_FILL;
	return MIN_FILL + ((total - min) / (max - min)) * (MAX_FILL - MIN_FILL);
}

export default function GuessDistribution({ distribution }) {
	// bars start at 0 width and grow once this flips to true
	const [animate, setAnimate] = useState(false);

	useEffect(() => {
		// wait two frames so the browser paints the empty bars first
		let frame = requestAnimationFrame(() => {
			frame = requestAnimationFrame(() => setAnimate(true));
		});
		return () => cancelAnimationFrame(frame);
	}, []);

	const totals = distribution.map((bucket) => bucket.total);
	const min = Math.min(...totals);
	const max = Math.max(...totals);

	return (
		<section className="flex flex-col gap-4 md:gap-6">
			<h2 className="font-pixel text-[1.5rem] md:text-[2rem] lg:text-[2.5rem] leading-tight">
				GUESS DISTRIBUTION
			</h2>
			<ol className="flex flex-col gap-3 lg:gap-5">
				{distribution.map((bucket, index) => {
					const tone = getTone(bucket.guesses);
					const percent = getFillPercent(bucket.total, min, max);
					return (
						<li
							key={bucket.guesses}
							className="flex items-center gap-3 md:gap-5 lg:gap-6"
						>
							<span className="w-4 md:w-6 text-center font-bold text-[1.25rem] md:text-[2rem] lg:text-[2.5rem] leading-none">
								{bucket.guesses}
							</span>
							<div
								role="img"
								aria-label={`${bucket.total} wins in ${bucket.guesses} ${bucket.guesses === 1 ? "guess" : "guesses"}`}
								className={`${tone.track} relative h-8 md:h-10 lg:h-12 flex-1 rounded-full border-[3px] md:border-4 border-text`}
							>
								{/* the fill sits over the track's border so only one outline shows */}
								<div
									className={`${tone.fill} absolute -top-[3px] -bottom-[3px] -left-[3px] md:-top-1 md:-bottom-1 md:-left-1 rounded-full border-[3px] md:border-4 border-text transition-[width] ease-in-out motion-reduce:transition-none`}
									style={{
										width: `${animate ? percent : 0}%`,
										transitionDuration: `${DURATION_MS}ms`,
										transitionDelay: `${index * STAGGER_MS}ms`,
									}}
								/>
								<span className="absolute right-3 md:right-5 lg:right-6 top-1/2 -translate-y-1/2 text-[1rem] md:text-[1.5rem] lg:text-[2rem] leading-none">
									{bucket.total}
								</span>
							</div>
						</li>
					);
				})}
			</ol>
		</section>
	);
}
