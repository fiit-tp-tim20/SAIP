import React, { useCallback, useEffect, useState } from 'react';
import { SelectedElementInfo } from './types';
import {
    AbstractMesh,
    Animation,
    Effect,
    Material,
    Scene,
    ShaderMaterial,
    SSAORenderingPipeline,
    Vector3,
} from '@babylonjs/core';
import { BabylonItem } from '../../constants';
import useXrModel from '../XrModelContext/useXrModel';
import useModelLayers from '../../hooks/useModelLayers';
import BabylonContext from './BabylonContext';
import { Bounds } from '../../types';

export const BabylonProvider = ({ children }) => {
    const { selectedElement } = useModelLayers();
    const { setAmbientOcclusion } = useXrModel();
    const [scene, setScene] = useState<Scene>();
    const [highlightAnimation, setHighlightAnimation] = useState<Animation>();
    const [sensorIdleAnimation, setSensorIdleAnimation] = useState<Animation>();
    const [transparency, setTransparency] = useState<number>(1);
    const [exceededTagIds, setExceededTagIds] = useState<string[]>([]);
    const [alertAnimation, setAlertAnimation] = useState<Animation>();
    const [ssao, setSsao] = useState<SSAORenderingPipeline>();
    const [sceneInitialized, setSceneInitialized] = useState<boolean>(false);
    const [selectedElementInfo, setSelectedElementInfo] =
        useState<SelectedElementInfo>();
    const [bounds, setBounds] = useState<Bounds>();
    const [clonedMesh, setClonedMesh] = useState<AbstractMesh>();

    useEffect(() => {
        if (!selectedElement && selectedElementInfo) unhighlightMesh();
    }, [selectedElementInfo, selectedElement]);

    const highlightMesh = useCallback(
        (mesh: AbstractMesh): void => {
            setSelectedElementInfo({
                name: mesh.name,
                materialName: mesh.material?.name,
            });

            // duplicate mesh
            const highlightMesh = mesh.clone('highlightMesh', mesh.parent);
            highlightMesh.setEnabled(true);

            setClonedMesh(highlightMesh);

            // hide original mesh
            // mesh.setEnabled(false)

            Effect.ShadersStore['customVertexShader'] =
                'precision highp float;\r\n' +
                'attribute vec3 position;\r\n' +
                'attribute vec2 uv;\r\n' +
                'uniform mat4 worldViewProjection;\r\n' +
                'varying vec2 vUV;\r\n' +
                'void main(void) {\r\n' +
                '    vec3 v = position;\r\n' +
                '    gl_Position = worldViewProjection * vec4(v, 1.0);\r\n' +
                '    vUV = uv;\r\n' +
                '}\r\n';

            Effect.ShadersStore['customFragmentShader'] =
                'precision highp float;\r\n' +
                'varying vec2 vUV;\r\n' +
                // 'uniform sampler2D textureSampler;\r\n' +
                'uniform float time;\r\n' +
                'void main(void) {\r\n' +
                '    vec4 color1 = vec4(0, .643, .678, 1);\r\n' +
                '    color1.a = 0.5;\r\n' +
                '    vec4 color2 = vec4(0, .643, .678, .5);\r\n' +
                '    color2.a = .3;\r\n' +
                '    vec4 color = mix(color1, color2, abs(mod(time * .2, 2.) - 1.));\r\n' +
                '    gl_FragColor = color;\r\n' +
                '}\r\n';

            // Compile
            const shaderMaterial = new ShaderMaterial(
                'shader',
                scene,
                {
                    vertex: 'custom',
                    fragment: 'custom',
                },
                {
                    attributes: ['position', 'normal', 'uv'],
                    uniforms: [
                        'world',
                        'worldView',
                        'worldViewProjection',
                        'view',
                        'projection',
                        'time',
                    ],
                }
            );

            let time = 0;
            shaderMaterial.setFloat('time', time);
            shaderMaterial.zOffset = -1;
            // set shader material to be transparent
            shaderMaterial.alpha = 0.99;
            setInterval(() => {
                time += 0.1;
                shaderMaterial.setFloat('time', time);
                // console.warn(shaderMaterial)
            }, 100);

            highlightMesh.material = shaderMaterial;
            // highlightMesh.material = scene.getMaterialByName(
            //     BabylonItem.HighlightMaterial
            // )

            // if (
            //     !mesh.animations.some(
            //         (animation) => animation.name === highlightAnimation.name
            //     )
            // )
            //     mesh.animations.push(highlightAnimation)

            // scene.beginAnimation(mesh, 0, 200, true)
        },
        [highlightAnimation, scene]
    );

    const unhighlightMesh = useCallback(() => {
        if (!scene) return;
        clonedMesh?.dispose();
        // const mesh = scene.getMeshByName(selectedElementInfo?.name)
        // setSelectedElementInfo(null)
        // if (mesh)
        //     mesh.material = scene.getMaterialByName(
        //         selectedElementInfo.materialName
        //     )
    }, [scene, selectedElementInfo, clonedMesh]);

    const toggleAmbientOcclusion = useCallback(
        (isEnabled: boolean): void => {
            const camera = scene.activeCamera;
            setAmbientOcclusion(isEnabled);

            if (isEnabled) {
                scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline(
                    BabylonItem.SSAO,
                    camera
                );
                scene.postProcessRenderPipelineManager.enableEffectInPipeline(
                    BabylonItem.SSAO,
                    ssao.SSAOCombineRenderEffect,
                    camera
                );
            } else {
                scene.postProcessRenderPipelineManager.detachCamerasFromRenderPipeline(
                    BabylonItem.SSAO,
                    camera
                );
            }
        },
        [scene]
    );

    return (
        <BabylonContext.Provider
            value={{
                scene,
                setScene,
                highlightAnimation,
                setHighlightAnimation,
                sensorIdleAnimation,
                setSensorIdleAnimation,
                transparency,
                setTransparency,
                exceededTagIds,
                setExceededTagIds,
                alertAnimation,
                setAlertAnimation,
                ssao,
                setSsao,
                toggleAmbientOcclusion,
                sceneInitialized,
                setSceneInitialized,
                highlightMesh,
                unhighlightMesh,
                bounds,
                setBounds,
            }}
        >
            {children}
        </BabylonContext.Provider>
    );
};
