(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/app/components/SelectedDiceView.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.module.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
const SelectedDiceView = ({ mesh })=>{
    _s();
    const viewRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SelectedDiceView.useEffect": ()=>{
            if (!viewRef.current) return;
            const renderer = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["WebGLRenderer"]({
                canvas: viewRef.current,
                alpha: true,
                antialias: true
            });
            renderer.setSize(100, 100);
            const scene = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Scene"]();
            const camera = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PerspectiveCamera"](45, 1, 0.1, 100);
            camera.position.set(0, 3, -3);
            camera.lookAt(0, 0, 0);
            scene.add(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AmbientLight"](0xffffff, 1));
            // 복제한 주사위
            const clone = mesh.clone(true);
            if (Array.isArray(mesh.material)) {
                clone.material = mesh.material.map({
                    "SelectedDiceView.useEffect": (m)=>m.clone()
                }["SelectedDiceView.useEffect"]);
            }
            clone.position.set(0, 0, 0);
            clone.quaternion.copy(mesh.quaternion); // 굴려진 방향 그대로 유지
            scene.add(clone);
            renderer.render(scene, camera);
            return ({
                "SelectedDiceView.useEffect": ()=>{
                    renderer.dispose();
                }
            })["SelectedDiceView.useEffect"];
        }
    }["SelectedDiceView.useEffect"], [
        mesh
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
        ref: viewRef,
        style: {
            width: 80,
            height: 80
        },
        className: "rounded-lg shadow"
    }, void 0, false, {
        fileName: "[project]/src/app/components/SelectedDiceView.tsx",
        lineNumber: 36,
        columnNumber: 10
    }, this);
};
_s(SelectedDiceView, "+1UFPp6aBTvtBt11VxaordythQA=");
_c = SelectedDiceView;
const __TURBOPACK__default__export__ = SelectedDiceView;
var _c;
__turbopack_context__.k.register(_c, "SelectedDiceView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/components/DiceRoller.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.module.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cannon$2d$es$2f$dist$2f$cannon$2d$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/cannon-es/dist/cannon-es.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$SelectedDiceView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/SelectedDiceView.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const DiceRoller = ()=>{
    _s();
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const scoreRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const rendererRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const sceneRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const cameraRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const diceMeshRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const physicsWorldRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const diceArrayRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const [selectedMeshes, setSelectedMeshes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const fixedPositions = [
        new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](8, 0, 0),
        new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](8, 1.5, 0),
        new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](8, 3.0, 0),
        new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](8, 4.5, 0),
        new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](8, 6.0, 0)
    ];
    const params = {
        numberOfDice: 5,
        segments: 40,
        edgeRadius: 0.07,
        notchRadius: 0.15,
        notchDepth: 0.1
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DiceRoller.useEffect": ()=>{
            const canvas = canvasRef.current;
            const scoreResult = scoreRef.current;
            if (!canvas || !scoreResult) return;
            const renderer = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["WebGLRenderer"]({
                canvas,
                alpha: true,
                antialias: true
            });
            renderer.shadowMap.enabled = true;
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.setSize(window.innerWidth, window.innerHeight - 100);
            rendererRef.current = renderer;
            const scene = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Scene"]();
            sceneRef.current = scene;
            const camera = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PerspectiveCamera"](45, window.innerWidth / (window.innerHeight - 100), 0.1, 300);
            camera.position.set(0, 15, 0);
            camera.up.set(0, 0, -1);
            camera.lookAt(0, 0, 0);
            cameraRef.current = camera;
            const ambientLight = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AmbientLight"](0xffffff, 5);
            scene.add(ambientLight);
            const topLight = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PointLight"](0xffffff, 3);
            topLight.position.set(0, 15, 0);
            topLight.castShadow = true;
            topLight.shadow.mapSize.width = 2048;
            topLight.shadow.mapSize.height = 2048;
            topLight.shadow.camera.near = 5;
            topLight.shadow.camera.far = 400;
            scene.add(topLight);
            scene.background = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"]('#f0f0f0');
            const physicsWorld = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cannon$2d$es$2f$dist$2f$cannon$2d$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["World"]({
                allowSleep: true,
                gravity: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cannon$2d$es$2f$dist$2f$cannon$2d$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vec3"](0, -50, 0)
            });
            physicsWorld.defaultContactMaterial.restitution = 0.3;
            physicsWorldRef.current = physicsWorld;
            const floor = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CircleGeometry"](5, 64), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
                color: 0x006600
            }) // 초록색 felt 느낌
            );
            floor.receiveShadow = true;
            floor.rotation.x = -Math.PI / 2;
            floor.position.y = -7;
            scene.add(floor);
            const floorBody = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cannon$2d$es$2f$dist$2f$cannon$2d$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Body"]({
                type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cannon$2d$es$2f$dist$2f$cannon$2d$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Body"].STATIC,
                shape: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cannon$2d$es$2f$dist$2f$cannon$2d$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Plane"]()
            });
            floorBody.position.copy(floor.position);
            floorBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
            physicsWorld.addBody(floorBody);
            const wallRadius = 5;
            const wallHeight = 2;
            const wallThickness = 0.3;
            // 비어 있는 원기둥으로 벽을 생성
            const wall = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cannon$2d$es$2f$dist$2f$cannon$2d$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Body"]({
                type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cannon$2d$es$2f$dist$2f$cannon$2d$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Body"].STATIC
            });
            const segments = 32;
            for(let i = 0; i < segments; i++){
                const theta = 2 * Math.PI * i / segments;
                const x = Math.cos(theta) * wallRadius;
                const z = Math.sin(theta) * wallRadius;
                const box = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cannon$2d$es$2f$dist$2f$cannon$2d$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Box"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cannon$2d$es$2f$dist$2f$cannon$2d$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vec3"](wallThickness / 2, wallHeight / 2, 0.2));
                const quaternion = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cannon$2d$es$2f$dist$2f$cannon$2d$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Quaternion"]();
                quaternion.setFromEuler(0, -theta, 0);
                wall.addShape(box, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cannon$2d$es$2f$dist$2f$cannon$2d$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vec3"](x, wallHeight / 2 - 7, z), quaternion);
            }
            physicsWorld.addBody(wall);
            const ring = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RingGeometry"](wallRadius - wallThickness, wallRadius + wallThickness, 64), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
                color: 0x8b4513,
                side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DoubleSide"]
            }) // 갈색 나무
            );
            ring.rotation.x = -Math.PI / 2;
            ring.position.y = -7 + 0.01; // 살짝 위로
            scene.add(ring);
            function createDiceTextures(baseColor = '#ffffff') {
                const textures = [];
                const dotRadius = 10;
                const size = 100;
                const dotPositions = [
                    [
                        [
                            1,
                            1
                        ]
                    ],
                    [
                        [
                            0,
                            0
                        ],
                        [
                            0,
                            2
                        ],
                        [
                            1,
                            0
                        ],
                        [
                            1,
                            2
                        ],
                        [
                            2,
                            0
                        ],
                        [
                            2,
                            2
                        ]
                    ],
                    [
                        [
                            0,
                            0
                        ],
                        [
                            2,
                            2
                        ]
                    ],
                    [
                        [
                            0,
                            0
                        ],
                        [
                            0,
                            2
                        ],
                        [
                            1,
                            1
                        ],
                        [
                            2,
                            0
                        ],
                        [
                            2,
                            2
                        ]
                    ],
                    [
                        [
                            0,
                            0
                        ],
                        [
                            1,
                            1
                        ],
                        [
                            2,
                            2
                        ]
                    ],
                    [
                        [
                            0,
                            0
                        ],
                        [
                            0,
                            2
                        ],
                        [
                            2,
                            0
                        ],
                        [
                            2,
                            2
                        ]
                    ]
                ];
                for(let i = 0; i < 6; i++){
                    const canvas = document.createElement('canvas');
                    canvas.width = canvas.height = size;
                    const ctx = canvas.getContext('2d');
                    ctx.fillStyle = baseColor; // ✅ 배경색
                    ctx.fillRect(0, 0, size, size);
                    ctx.fillStyle = '#000000';
                    const spacing = size / 4;
                    for (const [row, col] of dotPositions[i]){
                        ctx.beginPath();
                        ctx.arc(spacing * (col + 1), spacing * (row + 1), dotRadius, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    textures.push(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CanvasTexture"](canvas));
                }
                return textures;
            }
            function getTopFaceNumber(quaternion) {
                // 주사위의 로컬 Y+ 벡터 (윗면) → 월드 좌표계로 변환
                const up = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](0, 1, 0);
                // 각 면의 노멀과 숫자 매핑
                const faceNormals = [
                    {
                        normal: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](1, 0, 0),
                        number: 1
                    },
                    {
                        normal: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](-1, 0, 0),
                        number: 6
                    },
                    {
                        normal: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](0, 1, 0),
                        number: 2
                    },
                    {
                        normal: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](0, -1, 0),
                        number: 5
                    },
                    {
                        normal: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](0, 0, 1),
                        number: 3
                    },
                    {
                        normal: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](0, 0, -1),
                        number: 4
                    } // -Z → texture[5]
                ];
                // 가장 유사한 노멀 (코사인 유사도 기반)
                let maxDot = -Infinity;
                let topNumber = 0;
                for (const face of faceNormals){
                    const dot = up.dot(face.normal.applyQuaternion(quaternion));
                    if (dot > maxDot) {
                        maxDot = dot;
                        topNumber = face.number;
                    }
                }
                return topNumber;
            }
            const createDiceMesh = {
                "DiceRoller.useEffect.createDiceMesh": (color)=>{
                    const geometry = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BoxGeometry"](1, 1, 1);
                    const textures = createDiceTextures();
                    const materials = textures.map({
                        "DiceRoller.useEffect.createDiceMesh.materials": (texture)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
                                map: texture,
                                metalness: 0,
                                roughness: 0.3
                            })
                    }["DiceRoller.useEffect.createDiceMesh.materials"]);
                    const mesh = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](geometry, materials);
                    mesh.castShadow = true;
                    return mesh;
                }
            }["DiceRoller.useEffect.createDiceMesh"];
            const diceColors = [
                '#ffffff',
                '#ffdddd',
                '#ddffdd',
                '#ddddff',
                '#ffffdd'
            ];
            for(let i = 0; i < params.numberOfDice; i++){
                const index = i % diceColors.length;
                const mesh = createDiceMesh(diceColors[index]);
                scene.add(mesh);
                const body = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cannon$2d$es$2f$dist$2f$cannon$2d$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Body"]({
                    mass: 1,
                    shape: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cannon$2d$es$2f$dist$2f$cannon$2d$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Box"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cannon$2d$es$2f$dist$2f$cannon$2d$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vec3"](0.5, 0.5, 0.5)),
                    sleepTimeLimit: 0.1
                });
                const initialPosition = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cannon$2d$es$2f$dist$2f$cannon$2d$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vec3"](6, i * 1.5, 0);
                body.position.copy(initialPosition);
                mesh.position.copy(initialPosition);
                physicsWorld.addBody(body);
                diceArrayRef.current.push({
                    id: i,
                    mesh,
                    body,
                    selected: false,
                    originalPosition: initialPosition.clone(),
                    finalPosition: undefined,
                    finalQuaternion: undefined
                });
            }
            let scored = false;
            const render = {
                "DiceRoller.useEffect.render": ()=>{
                    physicsWorld.fixedStep();
                    let allSleeping = true;
                    for (const dice of diceArrayRef.current){
                        dice.mesh.position.copy(dice.body.position);
                        dice.mesh.quaternion.copy(dice.body.quaternion);
                        if (dice.body.sleepState !== __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cannon$2d$es$2f$dist$2f$cannon$2d$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Body"].SLEEPING) {
                            allSleeping = false;
                        }
                    }
                    if (allSleeping && !scored) {
                        const scores = diceArrayRef.current.map({
                            "DiceRoller.useEffect.render.scores": (d)=>getTopFaceNumber(d.mesh.quaternion)
                        }["DiceRoller.useEffect.render.scores"]);
                        scoreRef.current.innerHTML = scores.join(' + ') + ' = ' + scores.reduce({
                            "DiceRoller.useEffect.render": (a, b)=>a + b
                        }["DiceRoller.useEffect.render"], 0);
                        scored = true;
                    }
                    renderer.render(scene, camera);
                    requestAnimationFrame(render);
                }
            }["DiceRoller.useEffect.render"];
            const throwDice = {
                "DiceRoller.useEffect.throwDice": ()=>{
                    scored = false;
                    if (!scoreResult) return;
                    scoreResult.innerHTML = '';
                    diceArrayRef.current.forEach({
                        "DiceRoller.useEffect.throwDice": (d, i)=>{
                            d.body.velocity.setZero();
                            d.body.angularVelocity.setZero();
                            d.body.position = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cannon$2d$es$2f$dist$2f$cannon$2d$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vec3"](6, i * 1.5, 0);
                            d.mesh.position.copy(d.body.position);
                            d.mesh.rotation.set(2 * Math.PI * Math.random(), 0, 2 * Math.PI * Math.random());
                            // ✅ three.js quaternion → cannon-es quaternion 변환
                            const threeQuat = d.mesh.quaternion;
                            d.body.quaternion.set(threeQuat.x, threeQuat.y, threeQuat.z, threeQuat.w);
                            const force = 3 + 5 * Math.random();
                            d.body.applyImpulse(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cannon$2d$es$2f$dist$2f$cannon$2d$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vec3"](-force, force, 0), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cannon$2d$es$2f$dist$2f$cannon$2d$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vec3"](0, 0, 0.2));
                            d.body.allowSleep = true;
                        }
                    }["DiceRoller.useEffect.throwDice"]);
                }
            }["DiceRoller.useEffect.throwDice"];
            window.addEventListener('resize', {
                "DiceRoller.useEffect": ()=>{
                    camera.aspect = window.innerWidth / window.innerHeight;
                    camera.updateProjectionMatrix();
                    renderer.setSize(window.innerWidth, window.innerHeight);
                }
            }["DiceRoller.useEffect"]);
            throwDice();
            render();
            const raycaster = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Raycaster"]();
            const mouse = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector2"]();
            const onClick = {
                "DiceRoller.useEffect.onClick": (event)=>{
                    const rect = canvas.getBoundingClientRect();
                    mouse.x = (event.clientX - rect.left) / rect.width * 2 - 1;
                    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
                    raycaster.setFromCamera(mouse, camera);
                    const intersects = raycaster.intersectObjects(diceArrayRef.current.map({
                        "DiceRoller.useEffect.onClick.intersects": (d)=>d.mesh
                    }["DiceRoller.useEffect.onClick.intersects"]));
                    if (intersects.length > 0) {
                        const clickedMesh = intersects[0].object;
                        const diceItem = diceArrayRef.current.find({
                            "DiceRoller.useEffect.onClick.diceItem": (d)=>d.mesh === clickedMesh
                        }["DiceRoller.useEffect.onClick.diceItem"]);
                        if (!diceItem || diceItem.selected) return;
                        // 1️⃣ 선택 표시
                        diceItem.selected = true;
                        // 2️⃣ 현재 회전/위치 저장
                        diceItem.finalPosition = diceItem.mesh.position.clone();
                        diceItem.finalQuaternion = diceItem.mesh.quaternion.clone();
                        // 3️⃣ 씬에서 제거
                        scene.remove(diceItem.mesh);
                        // 4️⃣ 새 메시 생성 (같은 모양, 같은 회전)
                        const newMesh = diceItem.mesh.clone();
                        newMesh.position.copy(fixedPositions[selectedMeshes.length] ?? new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](8, 0, 0));
                        newMesh.quaternion.copy(diceItem.finalQuaternion);
                        // 그림자 등 옵션 유지
                        newMesh.castShadow = true;
                        // 5️⃣ 씬에 추가
                        scene.add(newMesh);
                        // 6️⃣ 오른쪽 UI에 표시
                        setSelectedMeshes({
                            "DiceRoller.useEffect.onClick": (prev)=>[
                                    ...prev,
                                    newMesh
                                ]
                        }["DiceRoller.useEffect.onClick"]);
                    }
                }
            }["DiceRoller.useEffect.onClick"];
            canvas.addEventListener('click', onClick);
            return ({
                "DiceRoller.useEffect": ()=>{
                    canvas.removeEventListener('click', onClick);
                }
            })["DiceRoller.useEffect"];
        }
    }["DiceRoller.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative w-full h-screen",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                ref: canvasRef,
                className: "absolute top-0 left-0 w-full h-full z-0"
            }, void 0, false, {
                fileName: "[project]/src/app/components/DiceRoller.tsx",
                lineNumber: 361,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        ref: scoreRef,
                        className: "text-lg font-semibold bg-white px-4 py-2 rounded shadow"
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/DiceRoller.tsx",
                        lineNumber: 366,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>window.location.reload(),
                        className: "ml-4 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600",
                        children: "Throw the Dice"
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/DiceRoller.tsx",
                        lineNumber: 367,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/DiceRoller.tsx",
                lineNumber: 364,
                columnNumber: 7
            }, this),
            selectedMeshes.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-4 right-4 z-20 bg-white p-4 rounded-lg shadow",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mb-2 font-semibold text-gray-700 text-center",
                        children: "🎯 Selected Dice"
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/DiceRoller.tsx",
                        lineNumber: 378,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col items-center gap-2",
                        children: selectedMeshes.map((mesh, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$SelectedDiceView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                mesh: mesh
                            }, index, false, {
                                fileName: "[project]/src/app/components/DiceRoller.tsx",
                                lineNumber: 381,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/DiceRoller.tsx",
                        lineNumber: 379,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/DiceRoller.tsx",
                lineNumber: 377,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/components/DiceRoller.tsx",
        lineNumber: 359,
        columnNumber: 5
    }, this);
};
_s(DiceRoller, "LoqKT9XO5sldkwg5TlGLfKy3yQE=");
_c = DiceRoller;
const __TURBOPACK__default__export__ = DiceRoller;
var _c;
__turbopack_context__.k.register(_c, "DiceRoller");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/dice/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$DiceRoller$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/DiceRoller.tsx [app-client] (ecmascript)");
'use client';
;
;
const Dice = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-center",
                children: "🎲 Dice Game"
            }, void 0, false, {
                fileName: "[project]/src/app/dice/page.tsx",
                lineNumber: 9,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$DiceRoller$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/dice/page.tsx",
                lineNumber: 10,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/dice/page.tsx",
        lineNumber: 8,
        columnNumber: 5
    }, this);
};
_c = Dice;
const __TURBOPACK__default__export__ = Dice;
var _c;
__turbopack_context__.k.register(_c, "Dice");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_app_b39ecfcc._.js.map