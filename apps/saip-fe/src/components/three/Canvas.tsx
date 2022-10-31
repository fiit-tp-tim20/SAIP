import React from "react";
import { Canvas } from "@react-three/fiber";
import { PresentationControls } from "@react-three/drei";
import { Vector3 } from "three";
import Bike from "./Bike";

type Props = {
	path: string;
};

export default function Test(props: Props) {
	return (
		<Canvas flat dpr={[1, 2]} camera={{ fov: 25, position: [0, 0, 12] }} className="rounded-2xl">
			<color attach="background" args={["#c9f0de"]} />
			<ambientLight intensity={2} />
			<pointLight position={[0, 0, 8]} intensity={12} />
			<PresentationControls
				global
				zoom={0.8}
				rotation={[0, -Math.PI / 4, 0]}
				polar={[0, Math.PI / 4]}
				azimuth={[-Math.PI / 4, Math.PI / 4]}
			>
				<group dispose={null} position={new Vector3(0, -1, 0)}>
					<Bike path={props.path} />
				</group>
			</PresentationControls>
		</Canvas>
	);
}
