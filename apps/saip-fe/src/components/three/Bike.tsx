import React from "react";
import { useGLTF } from "@react-three/drei";
import { Vector3 } from "three";

type Props = {
	position: Vector3;
};

function Bike(props: Props) {
	const { position } = props;
	const { nodes } = useGLTF("/bike.glb");

	return (
		<mesh position={position} scale={[2, 2, 2]} geometry={nodes.Bike.geometry}>
			<meshStandardMaterial attach="material" color="gray" />
		</mesh>
	);
}

export default Bike;
