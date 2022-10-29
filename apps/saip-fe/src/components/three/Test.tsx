import React from "react";
import { Canvas } from "@react-three/fiber";
import { PresentationControls } from "@react-three/drei";
import Bike from "./Bike";

export default function Test() {
	return (
		<Canvas flat dpr={[1, 2]} camera={{ fov: 25, position: [0, 0, 8] }} className="rounded-2xl">
			<color attach="background" args={["#c9f0de"]} />
			<ambientLight />
			<PresentationControls
				global
				zoom={0.8}
				rotation={[0, -Math.PI / 4, 0]}
				polar={[0, Math.PI / 4]}
				azimuth={[-Math.PI / 4, Math.PI / 4]}
			>
				<group position-y={-0.75} dispose={null}>
					<Bike position={[0, 0.5, 0]} />
				</group>
			</PresentationControls>
		</Canvas>
	);
}
