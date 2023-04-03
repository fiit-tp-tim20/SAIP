import React from "react";
import { Canvas } from "@react-three/fiber";
import { PresentationControls } from "@react-three/drei";
import { Vector3 } from "three";
import * as THREE from "three";
import Bike from "./Bike";

type Props = {
	cameraPosition?: Vector3;
	cameraRotation?: Vector3;
};

export default function Test(props: Props) {
	const { cameraPosition, cameraRotation } = props;

	return (
		<Canvas flat dpr={[1, 2]} camera={{ fov: 25, position: [0, 0, 12] }} className="rounded-2xl border-accent-700">
			{/* fix this pls :( 
            getComputedStyle(document.documentElement).getPropertyValue("--minContrastColor") === ""
            ? new THREE.Color(
                parseInt(
                    getComputedStyle(document.documentElement)
                    .getPropertyValue("--minContrastColor")
                    .slice(0, 8)
                    .replace("#", "0x"),
                    16,
                    ),
                )
            : new THREE.Color(0x8eedc7),
            */}
			<color attach="background" args={["#8EEDC7"]} />
			<ambientLight intensity={2} />
			<pointLight position={[0, 0, 8]} intensity={12} />
			<PresentationControls
				global
				zoom={0.8}
				rotation={[0, -Math.PI / 4, 0]}
				polar={[0, Math.PI / 4]}
				azimuth={[-Math.PI / 4, Math.PI / 4]}
			>
				<Bike
					position={new Vector3(0, -1, 0)}
					cameraPosition={cameraPosition}
					cameraRotation={cameraRotation}
				/>
			</PresentationControls>
		</Canvas>
	);
}
