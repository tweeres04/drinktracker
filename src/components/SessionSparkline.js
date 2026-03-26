import React, { useEffect, useState, useRef } from 'react';
import minDate from 'date-fns/min';
import addMinutes from 'date-fns/addMinutes';
import dateFormat from 'date-fns/format';

import currentDrinks from '../currentDrinks';

export default function SessionSparkline({
	drinks,
	now,
	variant = 'light',
	fullWidth = false,
}) {
	const [selected, setSelected] = useState(null);
	const svgRef = useRef(null);
	const gradientId = useRef(
		`sparkGrad-${Math.random().toString(36).slice(2)}`
	).current;

	useEffect(() => {
		if (selected === null) return;
		function handleOutsideClick(e) {
			if (svgRef.current && !svgRef.current.contains(e.target)) {
				setSelected(null);
			}
		}
		document.addEventListener('click', handleOutsideClick);
		return () => {
			document.removeEventListener('click', handleOutsideClick);
		};
	}, [selected]);

	if (!drinks || drinks.length === 0) return null;

	const times = drinks.map((d) => d.time);
	const start = minDate(times);
	const totalMinutes = (now - start) / 60000;
	if (totalMinutes <= 0) return null;

	// Sample every 2 minutes
	const steps = Math.max(Math.ceil(totalMinutes / 2), 2);
	const points = [];
	let maxVal = 0;
	for (let i = 0; i <= steps; i++) {
		const t = addMinutes(start, (totalMinutes * i) / steps);
		const drinksAtTime = drinks.filter((d) => d.time <= t);
		const val = currentDrinks({ drinks: drinksAtTime, now: t });
		if (val > maxVal) maxVal = val;
		points.push({ t, val });
	}

	if (maxVal === 0) return null;

	const isLight = variant === 'light';
	const lineColor = isLight
		? 'rgba(255, 255, 255, 0.5)'
		: 'hsl(171, 100%, 41%)';
	const dotColor = isLight ? 'white' : 'hsl(171, 100%, 41%)';
	const textColor = isLight ? 'white' : 'hsl(0, 0%, 48%)';
	const gradientStart = isLight ? 'white' : 'hsl(171, 100%, 41%)';

	const width = 300;
	const chartHeight = 80;
	const labelHeight = 14;
	const height = chartHeight + labelHeight;
	const padding = 4;
	const dataWidth = fullWidth ? width : width * (2 / 3);

	const xScale = (i) => padding + (i / steps) * (dataWidth - padding * 2);
	const yScale = (val) =>
		chartHeight - padding - (val / maxVal) * (chartHeight - padding * 2);

	// Build smooth cubic bezier path
	const coords = points.map((p, i) => ({ x: xScale(i), y: yScale(p.val) }));
	let linePath = `M${coords[0].x},${coords[0].y}`;
	for (let i = 1; i < coords.length; i++) {
		const prev = coords[i - 1];
		const curr = coords[i];
		const cpx = (prev.x + curr.x) / 2;
		linePath += ` C${cpx},${prev.y} ${cpx},${curr.y} ${curr.x},${curr.y}`;
	}

	const last = coords[coords.length - 1];
	const first = coords[0];
	const areaPath =
		linePath +
		` L${last.x},${yScale(0)} L${first.x},${yScale(0)} Z`;

	// Hour marks along the bottom, snapped to clock hours
	const hourMarks = [];
	const firstHour = new Date(start);
	firstHour.setMinutes(0, 0, 0);
	if (firstHour < start) firstHour.setHours(firstHour.getHours() + 1);
	for (
		let t = new Date(firstHour);
		t <= now;
		t = new Date(t.getTime() + 3600000)
	) {
		const minuteOffset = (t - start) / 60000;
		const stepIndex = (minuteOffset / totalMinutes) * steps;
		const x = xScale(stepIndex);
		hourMarks.push({ x, label: dateFormat(t, 'h a') });
	}

	const lastPoint = points[points.length - 1];
	const dotX = xScale(steps);
	const dotY = yScale(lastPoint.val);

	function handleTap(e) {
		const svg = svgRef.current;
		if (!svg) return;
		const rect = svg.getBoundingClientRect();
		const clientX = e.touches ? e.touches[0].clientX : e.clientX;
		const svgX = ((clientX - rect.left) / rect.width) * width;

		// Find nearest point
		let nearest = 0;
		let nearestDist = Infinity;
		for (let i = 0; i <= steps; i++) {
			const dist = Math.abs(xScale(i) - svgX);
			if (dist < nearestDist) {
				nearestDist = dist;
				nearest = i;
			}
		}

		if (selected === nearest) {
			setSelected(null);
		} else {
			setSelected(nearest);
		}
	}

	const sel = selected !== null ? points[selected] : null;
	const selX = selected !== null ? xScale(selected) : 0;
	const selY = selected !== null ? yScale(sel.val) : 0;
	const tooltipWidth = 80;
	const tooltipHeight = 36;
	const tooltipX = Math.min(
		Math.max(selX - tooltipWidth / 2, 0),
		width - tooltipWidth
	);
	const tooltipAbove = selY - tooltipHeight - 8;
	const tooltipY = tooltipAbove >= 0 ? tooltipAbove : selY + 8;

	return (
		<div className="has-text-centered" style={{ marginTop: '1rem' }}>
			<svg
				ref={svgRef}
				viewBox={`0 0 ${width} ${height}`}
				style={{ width: '100%', maxWidth: '400px', height: 'auto' }}
				onClick={handleTap}
			>
				<defs>
					<linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
						<stop offset="0%" stopColor={gradientStart} stopOpacity="0.15" />
						<stop offset="100%" stopColor={gradientStart} stopOpacity="0" />
					</linearGradient>
				</defs>
				<path d={areaPath} fill={`url(#${gradientId})`} />
				<path
					d={linePath}
					fill="none"
					stroke={lineColor}
					strokeWidth="2"
				/>
				{hourMarks.map((mark) => (
					<g key={mark.label}>
						<line
							x1={mark.x}
							y1={yScale(0)}
							x2={mark.x}
							y2={yScale(0) + 3}
							stroke={textColor}
							strokeWidth="1"
							opacity="0.3"
						/>
						<text
							x={mark.x}
							y={yScale(0) + labelHeight}
							textAnchor="middle"
							fill={textColor}
							fontSize="8"
							opacity="0.5"
						>
							{mark.label}
						</text>
					</g>
				))}
				<circle cx={dotX} cy={dotY} r="4" fill={dotColor} />
				<circle cx={dotX} cy={dotY} r="8" fill={dotColor} opacity="0.2" />
				{sel && (
					<>
						<line
							x1={selX}
							y1={selY}
							x2={selX}
							y2={yScale(0)}
							stroke={dotColor}
							strokeWidth="1"
							opacity="0.3"
						/>
						<circle cx={selX} cy={selY} r="4" fill={dotColor} />
						<rect
							x={tooltipX}
							y={tooltipY}
							width={tooltipWidth}
							height={tooltipHeight}
							rx="4"
							fill="rgba(0,0,0,0.6)"
						/>
						<text
							x={tooltipX + tooltipWidth / 2}
							y={tooltipY + 14}
							textAnchor="middle"
							fill="white"
							fontSize="10"
							fontWeight="600"
						>
							{sel.val.toFixed(2)} drinks
						</text>
						<text
							x={tooltipX + tooltipWidth / 2}
							y={tooltipY + 28}
							textAnchor="middle"
							fill="rgba(255,255,255,0.7)"
							fontSize="9"
						>
							{dateFormat(sel.t, 'h:mm a')}
						</text>
					</>
				)}
			</svg>
		</div>
	);
}
