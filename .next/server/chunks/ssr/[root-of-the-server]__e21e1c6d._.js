module.exports = {

"[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("react/jsx-dev-runtime", () => require("react/jsx-dev-runtime"));

module.exports = mod;
}}),
"[externals]/three [external] (three, esm_import)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
const mod = await __turbopack_context__.y("three");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[externals]/cannon-es [external] (cannon-es, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("cannon-es", () => require("cannon-es"));

module.exports = mod;
}}),
"[project]/src/utils/createDiceTextures.ts [ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "createDiceTextures": (()=>createDiceTextures)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/three [external] (three, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$29$__
]);
([__TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
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
        textures.push(new __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$29$__["CanvasTexture"](canvas));
    }
    return textures;
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/utils/generateDice.ts [ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
// utils/generateDice.ts
__turbopack_context__.s({
    "createDiceMesh": (()=>createDiceMesh),
    "generateDice": (()=>generateDice)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/three [external] (three, esm_import)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$cannon$2d$es__$5b$external$5d$__$28$cannon$2d$es$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/cannon-es [external] (cannon-es, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$createDiceTextures$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/createDiceTextures.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$createDiceTextures$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
([__TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$createDiceTextures$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
;
;
function createDiceMesh(color) {
    const geometry = new __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$29$__["BoxGeometry"](1, 1, 1);
    const textures = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$createDiceTextures$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["createDiceTextures"])(color);
    const materials = textures.map((texture)=>new __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$29$__["MeshStandardMaterial"]({
            map: texture,
            metalness: 0,
            roughness: 0.3
        }));
    const mesh = new __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$29$__["Mesh"](geometry, materials);
    mesh.castShadow = true;
    return mesh;
}
function generateDice(numberOfDice, scene, physicsWorld) {
    const diceColors = [
        '#ffffff',
        '#ffdddd',
        '#ddffdd',
        '#ddddff',
        '#ffffdd'
    ];
    const diceList = [];
    for(let i = 0; i < numberOfDice; i++){
        const index = i % diceColors.length;
        const mesh = createDiceMesh(diceColors[index]);
        scene.add(mesh);
        const body = new __TURBOPACK__imported__module__$5b$externals$5d2f$cannon$2d$es__$5b$external$5d$__$28$cannon$2d$es$2c$__cjs$29$__["Body"]({
            mass: 1,
            shape: new __TURBOPACK__imported__module__$5b$externals$5d2f$cannon$2d$es__$5b$external$5d$__$28$cannon$2d$es$2c$__cjs$29$__["Box"](new __TURBOPACK__imported__module__$5b$externals$5d2f$cannon$2d$es__$5b$external$5d$__$28$cannon$2d$es$2c$__cjs$29$__["Vec3"](0.5, 0.5, 0.5)),
            sleepTimeLimit: 0.1
        });
        const initialPosition = new __TURBOPACK__imported__module__$5b$externals$5d2f$cannon$2d$es__$5b$external$5d$__$28$cannon$2d$es$2c$__cjs$29$__["Vec3"](6, i * 1.5, 0);
        body.position.copy(initialPosition);
        mesh.position.copy(initialPosition);
        physicsWorld.addBody(body);
        diceList.push({
            id: i,
            mesh,
            body,
            selected: false,
            originalPosition: initialPosition.clone(),
            stoppedPosition: undefined,
            stoppedQuaternion: undefined
        });
    }
    return diceList;
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/utils/getTopFaceNumber.ts [ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "getTopFaceNumber": (()=>getTopFaceNumber)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/three [external] (three, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$29$__
]);
([__TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
function getTopFaceNumber(quaternion) {
    // 주사위의 로컬 Y+ 벡터 (윗면) → 월드 좌표계로 변환
    const up = new __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$29$__["Vector3"](0, 1, 0);
    // 각 면의 노멀과 숫자 매핑
    const faceNormals = [
        {
            normal: new __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$29$__["Vector3"](1, 0, 0),
            number: 1
        },
        {
            normal: new __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$29$__["Vector3"](-1, 0, 0),
            number: 6
        },
        {
            normal: new __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$29$__["Vector3"](0, 1, 0),
            number: 2
        },
        {
            normal: new __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$29$__["Vector3"](0, -1, 0),
            number: 5
        },
        {
            normal: new __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$29$__["Vector3"](0, 0, 1),
            number: 3
        },
        {
            normal: new __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$29$__["Vector3"](0, 0, -1),
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
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/components/DiceRoller.tsx [ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/three [external] (three, esm_import)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$cannon$2d$es__$5b$external$5d$__$28$cannon$2d$es$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/cannon-es [external] (cannon-es, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$generateDice$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/generateDice.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$getTopFaceNumber$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/getTopFaceNumber.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$generateDice$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$getTopFaceNumber$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
([__TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$generateDice$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$getTopFaceNumber$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
'use client';
;
;
;
;
;
;
const DiceRoller = ()=>{
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const scoreRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const rendererRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const sceneRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const cameraRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const diceMeshRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const physicsWorldRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const diceArrayRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])([]);
    const [selectedMeshes, setSelectedMeshes] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [selectedDiceMap, setSelectedDiceMap] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(new Map());
    const selectedCountRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(0); // 선택된 주사위 개수 추적
    const selectedMeshRefs = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])([]);
    const fixedPositions = [
        new __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$29$__["Vector3"](6, 0, 0),
        new __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$29$__["Vector3"](6, 0, 2),
        new __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$29$__["Vector3"](6, 0, -2),
        new __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$29$__["Vector3"](6, 0, 4),
        new __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$29$__["Vector3"](6, 0, -4)
    ];
    const params = {
        numberOfDice: 5,
        segments: 40,
        edgeRadius: 0.07,
        notchRadius: 0.15,
        notchDepth: 0.1
    };
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const canvas = canvasRef.current;
        const scoreResult = scoreRef.current;
        if (!canvas || !scoreResult) return;
        const renderer = new __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$29$__["WebGLRenderer"]({
            canvas,
            alpha: true,
            antialias: true
        });
        renderer.shadowMap.enabled = true;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight - 100);
        rendererRef.current = renderer;
        const scene = new __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$29$__["Scene"]();
        sceneRef.current = scene;
        const camera = new __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$29$__["PerspectiveCamera"](45, window.innerWidth / (window.innerHeight - 100), 0.1, 300);
        camera.position.set(0, 15, 0);
        camera.up.set(0, 0, -1);
        camera.lookAt(0, 0, 0);
        cameraRef.current = camera;
        const ambientLight = new __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$29$__["AmbientLight"](0xffffff, 5);
        scene.add(ambientLight);
        const topLight = new __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$29$__["PointLight"](0xffffff, 3);
        topLight.position.set(0, 15, 0);
        topLight.castShadow = true;
        topLight.shadow.mapSize.width = 2048;
        topLight.shadow.mapSize.height = 2048;
        topLight.shadow.camera.near = 5;
        topLight.shadow.camera.far = 400;
        scene.add(topLight);
        scene.background = new __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$29$__["Color"]('#f0f0f0');
        const physicsWorld = new __TURBOPACK__imported__module__$5b$externals$5d2f$cannon$2d$es__$5b$external$5d$__$28$cannon$2d$es$2c$__cjs$29$__["World"]({
            allowSleep: true,
            gravity: new __TURBOPACK__imported__module__$5b$externals$5d2f$cannon$2d$es__$5b$external$5d$__$28$cannon$2d$es$2c$__cjs$29$__["Vec3"](0, -50, 0)
        });
        physicsWorld.defaultContactMaterial.restitution = 0.3;
        physicsWorldRef.current = physicsWorld;
        const floor = new __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$29$__["CircleGeometry"](5, 64), new __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$29$__["MeshStandardMaterial"]({
            color: 0x006600
        }) // 초록색 felt 느낌
        );
        floor.receiveShadow = true;
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -7;
        scene.add(floor);
        const floorBody = new __TURBOPACK__imported__module__$5b$externals$5d2f$cannon$2d$es__$5b$external$5d$__$28$cannon$2d$es$2c$__cjs$29$__["Body"]({
            type: __TURBOPACK__imported__module__$5b$externals$5d2f$cannon$2d$es__$5b$external$5d$__$28$cannon$2d$es$2c$__cjs$29$__["Body"].STATIC,
            shape: new __TURBOPACK__imported__module__$5b$externals$5d2f$cannon$2d$es__$5b$external$5d$__$28$cannon$2d$es$2c$__cjs$29$__["Plane"]()
        });
        floorBody.position.copy(floor.position);
        floorBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
        physicsWorld.addBody(floorBody);
        const wallRadius = 5;
        const wallHeight = 2;
        const wallThickness = 0.3;
        // 비어 있는 원기둥으로 벽을 생성
        const wall = new __TURBOPACK__imported__module__$5b$externals$5d2f$cannon$2d$es__$5b$external$5d$__$28$cannon$2d$es$2c$__cjs$29$__["Body"]({
            type: __TURBOPACK__imported__module__$5b$externals$5d2f$cannon$2d$es__$5b$external$5d$__$28$cannon$2d$es$2c$__cjs$29$__["Body"].STATIC
        });
        const segments = 32;
        for(let i = 0; i < segments; i++){
            const theta = 2 * Math.PI * i / segments;
            const x = Math.cos(theta) * wallRadius;
            const z = Math.sin(theta) * wallRadius;
            const box = new __TURBOPACK__imported__module__$5b$externals$5d2f$cannon$2d$es__$5b$external$5d$__$28$cannon$2d$es$2c$__cjs$29$__["Box"](new __TURBOPACK__imported__module__$5b$externals$5d2f$cannon$2d$es__$5b$external$5d$__$28$cannon$2d$es$2c$__cjs$29$__["Vec3"](wallThickness / 2, wallHeight / 2, 0.2));
            const quaternion = new __TURBOPACK__imported__module__$5b$externals$5d2f$cannon$2d$es__$5b$external$5d$__$28$cannon$2d$es$2c$__cjs$29$__["Quaternion"]();
            quaternion.setFromEuler(0, -theta, 0);
            wall.addShape(box, new __TURBOPACK__imported__module__$5b$externals$5d2f$cannon$2d$es__$5b$external$5d$__$28$cannon$2d$es$2c$__cjs$29$__["Vec3"](x, wallHeight / 2 - 7, z), quaternion);
        }
        physicsWorld.addBody(wall);
        const ring = new __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$29$__["RingGeometry"](wallRadius - wallThickness, wallRadius + wallThickness, 64), new __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$29$__["MeshStandardMaterial"]({
            color: 0x8b4513,
            side: __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$29$__["DoubleSide"]
        }) // 갈색 나무
        );
        ring.rotation.x = -Math.PI / 2;
        ring.position.y = -7 + 0.01; // 살짝 위로
        scene.add(ring);
        const newDice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$generateDice$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["generateDice"])(params.numberOfDice, scene, physicsWorld); // generate DICE
        diceArrayRef.current = newDice;
        let scored = false;
        const render = ()=>{
            physicsWorld.fixedStep();
            let allSleeping = true;
            for (const dice of diceArrayRef.current){
                dice.mesh.position.copy(dice.body.position);
                dice.mesh.quaternion.copy(dice.body.quaternion);
                if (dice.body.sleepState !== __TURBOPACK__imported__module__$5b$externals$5d2f$cannon$2d$es__$5b$external$5d$__$28$cannon$2d$es$2c$__cjs$29$__["Body"].SLEEPING) {
                    allSleeping = false;
                }
            }
            if (allSleeping && !scored) {
                const scores = diceArrayRef.current.map((d)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$getTopFaceNumber$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["getTopFaceNumber"])(d.mesh.quaternion));
                scoreRef.current.innerHTML = scores.join(' + ') + ' = ' + scores.reduce((a, b)=>a + b, 0);
                scored = true;
            }
            renderer.render(scene, camera);
            requestAnimationFrame(render);
        };
        const throwDice = ()=>{
            scored = false;
            if (!scoreResult) return;
            scoreResult.innerHTML = '';
            diceArrayRef.current.forEach((d, i)=>{
                d.body.velocity.setZero();
                d.body.angularVelocity.setZero();
                d.body.position = new __TURBOPACK__imported__module__$5b$externals$5d2f$cannon$2d$es__$5b$external$5d$__$28$cannon$2d$es$2c$__cjs$29$__["Vec3"](6, i * 1.5, 0);
                d.mesh.position.copy(d.body.position);
                d.mesh.rotation.set(2 * Math.PI * Math.random(), 0, 2 * Math.PI * Math.random());
                // ✅ three.js quaternion → cannon-es quaternion 변환
                const threeQuat = d.mesh.quaternion;
                d.body.quaternion.set(threeQuat.x, threeQuat.y, threeQuat.z, threeQuat.w);
                const force = 3 + 5 * Math.random();
                d.body.applyImpulse(new __TURBOPACK__imported__module__$5b$externals$5d2f$cannon$2d$es__$5b$external$5d$__$28$cannon$2d$es$2c$__cjs$29$__["Vec3"](-force, force, 0), new __TURBOPACK__imported__module__$5b$externals$5d2f$cannon$2d$es__$5b$external$5d$__$28$cannon$2d$es$2c$__cjs$29$__["Vec3"](0, 0, 0.2));
                d.body.allowSleep = true;
            });
        };
        window.addEventListener('resize', ()=>{
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
        throwDice();
        render();
        const raycaster = new __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$29$__["Raycaster"]();
        const mouse = new __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$29$__["Vector2"]();
        const onClick = (event)=>{
            if (!canvasRef.current || !cameraRef.current || !physicsWorldRef.current) return;
            const rect = canvasRef.current.getBoundingClientRect();
            mouse.x = (event.clientX - rect.left) / rect.width * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(mouse, cameraRef.current);
            // 모든 주사위 (선택 여부 관계없이)에 대해 교차 검사
            const intersects = raycaster.intersectObjects(diceArrayRef.current.map((d)=>d.mesh), true);
            if (intersects.length === 0) return;
            const clickedMesh = intersects[0].object;
            // 클릭된 메시가 어떤 Dice 객체에 해당하는지 찾음
            const clickedDice = diceArrayRef.current.find((d)=>d.mesh === clickedMesh);
            if (!clickedDice) return; // 클릭된 메시가 주사위가 아니면 리턴
            if (clickedDice.selected) {
                // 🎯 이미 선택된 주사위를 다시 클릭 → 원래 상태로 복원
                console.log("Clicked on an already selected dice. Restoring it.");
                clickedDice.selected = false;
                // 물리 바디를 다시 활성화 (DYNAMIC)
                clickedDice.body.type = __TURBOPACK__imported__module__$5b$externals$5d2f$cannon$2d$es__$5b$external$5d$__$28$cannon$2d$es$2c$__cjs$29$__["Body"].DYNAMIC;
                clickedDice.body.allowSleep = true;
                clickedDice.body.velocity.setZero();
                clickedDice.body.angularVelocity.setZero();
                // 저장해 둔 물리 시뮬레이션이 멈춘 위치/회전으로 복원
                if (clickedDice.stoppedPosition && clickedDice.stoppedQuaternion) {
                    clickedDice.body.position.copy(new __TURBOPACK__imported__module__$5b$externals$5d2f$cannon$2d$es__$5b$external$5d$__$28$cannon$2d$es$2c$__cjs$29$__["Vec3"](clickedDice.stoppedPosition.x, clickedDice.stoppedPosition.y, clickedDice.stoppedPosition.z));
                    clickedDice.body.quaternion.copy(new __TURBOPACK__imported__module__$5b$externals$5d2f$cannon$2d$es__$5b$external$5d$__$28$cannon$2d$es$2c$__cjs$29$__["Quaternion"](clickedDice.stoppedQuaternion.x, clickedDice.stoppedQuaternion.y, clickedDice.stoppedQuaternion.z, clickedDice.stoppedQuaternion.w));
                } else {
                    // stoppedPosition이 없으면 초기 originalPosition으로 복원 (안전 장치)
                    clickedDice.body.position.copy(clickedDice.originalPosition);
                    clickedDice.body.quaternion.set(0, 0, 0, 1);
                }
                clickedDice.mesh.position.copy(clickedDice.body.position);
                clickedDice.mesh.quaternion.copy(clickedDice.body.quaternion);
                clickedDice.body.wakeUp(); // 물리 시뮬레이션에 참여하도록 깨우기
                setSelectedMeshes((prev)=>prev.filter((m)=>m.uuid !== clickedDice.mesh.uuid));
                setSelectedDiceMap((prev)=>{
                    const map = new Map(prev);
                    map.delete(clickedDice.mesh.uuid);
                    return map;
                });
                selectedCountRef.current -= 1;
            } else {
                // 🎲 선택되지 않은 주사위를 클릭 → 선택된 위치로 이동
                console.log("Clicked on an unselected dice. Selecting it.");
                // 주사위가 멈춰있을 때만 선택 가능하도록 (선택 시점의 최종 위치 저장)
                if (clickedDice.body.sleepState !== __TURBOPACK__imported__module__$5b$externals$5d2f$cannon$2d$es__$5b$external$5d$__$28$cannon$2d$es$2c$__cjs$29$__["Body"].SLEEPING) {
                    console.log("Dice is still moving, cannot select.");
                    return;
                }
                clickedDice.selected = true;
                clickedDice.stoppedPosition = clickedDice.mesh.position.clone(); // 물리 시뮬레이션이 멈춘 위치 저장
                clickedDice.stoppedQuaternion = clickedDice.mesh.quaternion.clone(); // 물리 시뮬레이션이 멈춘 회전 저장
                // 물리 바디를 STATIC으로 변경하여 물리 시뮬레이션의 영향을 받지 않도록 함
                clickedDice.body.type = __TURBOPACK__imported__module__$5b$externals$5d2f$cannon$2d$es__$5b$external$5d$__$28$cannon$2d$es$2c$__cjs$29$__["Body"].STATIC;
                clickedDice.body.allowSleep = false; // 더 이상 슬립 상태가 되면 안됨
                // 화면상에서 주사위를 고정된 위치로 직접 이동
                const currentSelectedCount = selectedCountRef.current;
                const targetPosition = fixedPositions[currentSelectedCount] ?? new __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$29$__["Vector3"](8, currentSelectedCount * 1.5, 0);
                clickedDice.mesh.position.copy(targetPosition);
                // 회전은 유지하거나 필요하면 특정 각도로 고정
                // clickedDice.mesh.quaternion.identity(); // 예: 선택 시 정렬하고 싶다면
                // 물리 바디의 위치도 해당 위치로 직접 설정
                clickedDice.body.position.copy(new __TURBOPACK__imported__module__$5b$externals$5d2f$cannon$2d$es__$5b$external$5d$__$28$cannon$2d$es$2c$__cjs$29$__["Vec3"](targetPosition.x, targetPosition.y, targetPosition.z));
                // 물리 바디의 회전도 메시와 동기화
                clickedDice.body.quaternion.copy(new __TURBOPACK__imported__module__$5b$externals$5d2f$cannon$2d$es__$5b$external$5d$__$28$cannon$2d$es$2c$__cjs$29$__["Quaternion"](clickedDice.mesh.quaternion.x, clickedDice.mesh.quaternion.y, clickedDice.mesh.quaternion.z, clickedDice.mesh.quaternion.w));
                setSelectedMeshes((prev)=>[
                        ...prev,
                        clickedDice.mesh
                    ]);
                setSelectedDiceMap((prev)=>{
                    const map = new Map(prev);
                    map.set(clickedDice.mesh.uuid, clickedDice);
                    return map;
                });
                selectedCountRef.current += 1;
            }
        };
        canvas.addEventListener('click', onClick);
        return ()=>{
            canvas.removeEventListener('click', onClick);
        };
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "relative w-full h-screen",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("canvas", {
                ref: canvasRef,
                className: "absolute top-0 left-0 w-full h-full z-0"
            }, void 0, false, {
                fileName: "[project]/src/components/DiceRoller.tsx",
                lineNumber: 318,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "absolute top-4 left-4 z-10 bg-white px-3 py-2 rounded shadow text-gray-800 font-medium",
                children: [
                    "선택된 주사위: ",
                    selectedMeshes.length,
                    "개"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/DiceRoller.tsx",
                lineNumber: 319,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                        ref: scoreRef,
                        className: "text-lg font-semibold bg-white px-4 py-2 rounded shadow"
                    }, void 0, false, {
                        fileName: "[project]/src/components/DiceRoller.tsx",
                        lineNumber: 325,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        onClick: ()=>window.location.reload(),
                        className: "ml-4 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600",
                        children: "Throw the Dice"
                    }, void 0, false, {
                        fileName: "[project]/src/components/DiceRoller.tsx",
                        lineNumber: 326,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/DiceRoller.tsx",
                lineNumber: 323,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/DiceRoller.tsx",
        lineNumber: 316,
        columnNumber: 5
    }, this);
};
const __TURBOPACK__default__export__ = DiceRoller;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/pages/dice.tsx [ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$DiceRoller$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/DiceRoller.tsx [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$DiceRoller$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__
]);
([__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$DiceRoller$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
'use client';
;
;
const Dice = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                className: "text-center",
                children: "🎲 Dice Game"
            }, void 0, false, {
                fileName: "[project]/src/pages/dice.tsx",
                lineNumber: 9,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$DiceRoller$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/pages/dice.tsx",
                lineNumber: 10,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/pages/dice.tsx",
        lineNumber: 8,
        columnNumber: 5
    }, this);
};
const __TURBOPACK__default__export__ = Dice;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/node_modules/next/dist/esm/server/route-modules/pages/module.compiled.js [ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
if ("TURBOPACK compile-time falsy", 0) {
    "TURBOPACK unreachable";
} else {
    if ("TURBOPACK compile-time truthy", 1) {
        if ("TURBOPACK compile-time truthy", 1) {
            module.exports = __turbopack_context__.r("[externals]/next/dist/compiled/next-server/pages-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-turbo.runtime.dev.js, cjs)");
        } else {
            "TURBOPACK unreachable";
        }
    } else {
        "TURBOPACK unreachable";
    }
} //# sourceMappingURL=module.compiled.js.map
}}),
"[project]/node_modules/next/dist/esm/server/route-kind.js [ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "RouteKind": (()=>RouteKind)
});
var RouteKind = /*#__PURE__*/ function(RouteKind) {
    /**
   * `PAGES` represents all the React pages that are under `pages/`.
   */ RouteKind["PAGES"] = "PAGES";
    /**
   * `PAGES_API` represents all the API routes under `pages/api/`.
   */ RouteKind["PAGES_API"] = "PAGES_API";
    /**
   * `APP_PAGE` represents all the React pages that are under `app/` with the
   * filename of `page.{j,t}s{,x}`.
   */ RouteKind["APP_PAGE"] = "APP_PAGE";
    /**
   * `APP_ROUTE` represents all the API routes and metadata routes that are under `app/` with the
   * filename of `route.{j,t}s{,x}`.
   */ RouteKind["APP_ROUTE"] = "APP_ROUTE";
    /**
   * `IMAGE` represents all the images that are generated by `next/image`.
   */ RouteKind["IMAGE"] = "IMAGE";
    return RouteKind;
}({}); //# sourceMappingURL=route-kind.js.map
}}),
"[project]/node_modules/next/dist/esm/build/templates/helpers.js [ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/**
 * Hoists a name from a module or promised module.
 *
 * @param module the module to hoist the name from
 * @param name the name to hoist
 * @returns the value on the module (or promised module)
 */ __turbopack_context__.s({
    "hoist": (()=>hoist)
});
function hoist(module, name) {
    // If the name is available in the module, return it.
    if (name in module) {
        return module[name];
    }
    // If a property called `then` exists, assume it's a promise and
    // return a promise that resolves to the name.
    if ('then' in module && typeof module.then === 'function') {
        return module.then((mod)=>hoist(mod, name));
    }
    // If we're trying to hoise the default export, and the module is a function,
    // return the module itself.
    if (typeof module === 'function' && name === 'default') {
        return module;
    }
    // Otherwise, return undefined.
    return undefined;
} //# sourceMappingURL=helpers.js.map
}}),
"[project]/node_modules/next/dist/esm/build/templates/pages.js { INNER_PAGE => \"[project]/src/pages/dice.tsx [ssr] (ecmascript)\", INNER_DOCUMENT => \"[project]/node_modules/next/document.js [ssr] (ecmascript)\", INNER_APP => \"[project]/node_modules/next/app.js [ssr] (ecmascript)\" } [ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "config": (()=>config),
    "default": (()=>__TURBOPACK__default__export__),
    "getServerSideProps": (()=>getServerSideProps),
    "getStaticPaths": (()=>getStaticPaths),
    "getStaticProps": (()=>getStaticProps),
    "reportWebVitals": (()=>reportWebVitals),
    "routeModule": (()=>routeModule),
    "unstable_getServerProps": (()=>unstable_getServerProps),
    "unstable_getServerSideProps": (()=>unstable_getServerSideProps),
    "unstable_getStaticParams": (()=>unstable_getStaticParams),
    "unstable_getStaticPaths": (()=>unstable_getStaticPaths),
    "unstable_getStaticProps": (()=>unstable_getStaticProps)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$route$2d$modules$2f$pages$2f$module$2e$compiled$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/route-modules/pages/module.compiled.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$route$2d$kind$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/route-kind.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/build/templates/helpers.js [ssr] (ecmascript)");
// Import the app and document modules.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$document$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/document.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$app$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/app.js [ssr] (ecmascript)");
// Import the userland code.
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$dice$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/pages/dice.tsx [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$dice$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__
]);
([__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$dice$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
;
;
;
;
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["hoist"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$dice$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, 'default');
const getStaticProps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["hoist"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$dice$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, 'getStaticProps');
const getStaticPaths = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["hoist"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$dice$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, 'getStaticPaths');
const getServerSideProps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["hoist"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$dice$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, 'getServerSideProps');
const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["hoist"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$dice$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, 'config');
const reportWebVitals = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["hoist"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$dice$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, 'reportWebVitals');
const unstable_getStaticProps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["hoist"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$dice$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, 'unstable_getStaticProps');
const unstable_getStaticPaths = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["hoist"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$dice$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, 'unstable_getStaticPaths');
const unstable_getStaticParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["hoist"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$dice$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, 'unstable_getStaticParams');
const unstable_getServerProps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["hoist"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$dice$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, 'unstable_getServerProps');
const unstable_getServerSideProps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["hoist"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$dice$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, 'unstable_getServerSideProps');
const routeModule = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$route$2d$modules$2f$pages$2f$module$2e$compiled$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["PagesRouteModule"]({
    definition: {
        kind: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$route$2d$kind$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["RouteKind"].PAGES,
        page: "/dice",
        pathname: "/dice",
        // The following aren't used in production.
        bundlePath: '',
        filename: ''
    },
    components: {
        // default export might not exist when optimized for data only
        App: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$app$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"],
        Document: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$document$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"]
    },
    userland: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$dice$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__
}); //# sourceMappingURL=pages.js.map
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__e21e1c6d._.js.map