import React, { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { PresentationControls } from "@react-three/drei";
import Bike from "./Bike";
import { Vector3 } from "three";

export default function Test() {
	return (
		<Canvas flat dpr={[1, 2]} camera={{ fov: 25, position: [0, 0, 8] }} className="rounded-2xl">
			<color attach="background" args={["#c9f0de"]} />
			<ambientLight />
			<pointLight position={[1, 1, 1]} />
			<PresentationControls
				global
				zoom={0.8}
				rotation={[0, -Math.PI / 4, 0]}
				polar={[0, Math.PI / 4]}
				azimuth={[-Math.PI / 4, Math.PI / 4]}
			>
				<group dispose={null} position={new Vector3(0, -0.25, 0)}>
					<Bike />
				</group>
			</PresentationControls>
		</Canvas>
	);
}
