import React, { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { Color, Mesh } from "three";

function Bike() {
	const { nodes } = useGLTF("/bike_test.glb");

	const upgradeRef = useRef<Mesh>(null!);

	// hide upgradeRef.current after 5 seconds
	useEffect(() => {
		let isVisible = upgradeRef.current.visible;
		setInterval(() => {
			upgradeRef.current.visible = !isVisible;
			isVisible = !isVisible;
			upgradeRef.current.material.color = new Color(
				`#${(0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6)}`,
			);
		}, 1000);
	}, []);

	return (
		<>
			<mesh scale={[2, 2, 2]} geometry={nodes.Bike.geometry}>
				<meshToonMaterial attach="material" color="gray" />
			</mesh>
			<mesh scale={[2, 2, 2]} geometry={nodes.Upgrade_1.geometry} ref={upgradeRef}>
				<meshToonMaterial attach="material" color="hotpink" />
			</mesh>
			<mesh scale={[2, 2, 2]} geometry={nodes.test_cube.geometry}>
				<meshToonMaterial attach="material" color="hotpink" />
			</mesh>
		</>
	);
}

export default Bike;
