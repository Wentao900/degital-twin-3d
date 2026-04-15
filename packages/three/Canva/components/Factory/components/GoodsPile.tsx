import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { assetUrl } from '../../../utils/assetUrl';
import type { GoodsPile } from '../data/goodsPiles';

interface Props {
  pile: GoodsPile;
  selected: boolean;
  onSelect: (pileId: string) => void;
  onClose: () => void;
}

export default function GoodsPileComponent({ pile, selected, onSelect, onClose }: Props) {
  const { position, layout, box } = pile;
  const { rows, cols, levels, gap } = layout;
  const [boxW, boxH, boxD] = box.size;

  const textureUrl = useMemo(() => {
    if (!box.textureUrl) return assetUrl('/static/goods_texture.png');
    if (box.textureUrl.startsWith('http')) return box.textureUrl;
    return assetUrl(box.textureUrl);
  }, [box.textureUrl]);

  const colorMap = useLoader(TextureLoader, textureUrl);

  const geometry = useMemo(() => new THREE.BoxGeometry(boxW, boxH, boxD), [boxW, boxH, boxD]);

  const normalMaterial = useMemo(
    () =>
      new THREE.MeshPhongMaterial({
        color: box.color ?? '#d0975d',
        map: colorMap,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [box.color, colorMap]
  );

  const highlightMaterial = useMemo(
    () =>
      new THREE.MeshPhongMaterial({
        color: '#ffffff',
        emissive: new THREE.Color(box.color ?? '#d0975d'),
        emissiveIntensity: 0.7,
        map: colorMap,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [box.color, colorMap]
  );

  const boxPositions = useMemo(() => {
    const result: [number, number, number][] = [];
    for (let level = 0; level < levels; level++) {
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          result.push([
            col * (boxW + gap) + boxW / 2,
            level * (boxH + gap) + boxH / 2,
            row * (boxD + gap) + boxD / 2,
          ]);
        }
      }
    }
    return result;
  }, [rows, cols, levels, gap, boxW, boxH, boxD]);

  const pileWidth = cols * (boxW + gap) - gap;
  const pileHeight = levels * (boxH + gap) - gap;
  const pileDepth = rows * (boxD + gap) - gap;
  const htmlPos: [number, number, number] = [pileWidth / 2, pileHeight + 100, pileDepth / 2];

  return (
    <group
      position={position}
      onPointerDown={(e) => {
        e.stopPropagation();
        onSelect(pile.pileId);
      }}
    >
      {boxPositions.map((pos, i) => (
        <mesh
          key={i}
          geometry={geometry}
          material={selected ? highlightMaterial : normalMaterial}
          position={pos}
        />
      ))}

      {selected && (
        <Html position={htmlPos} distanceFactor={350} transform sprite>
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.80)',
              border: '1px solid #00acac',
              borderRadius: 6,
              padding: '10px 14px',
              color: '#efefef',
              minWidth: 230,
              fontSize: 14,
              fontFamily: 'sans-serif',
              cursor: 'default',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 8,
                paddingBottom: 6,
                borderBottom: '1px solid #00acac',
                fontSize: 16,
                fontWeight: 'bold',
              }}
            >
              <span>货主信息</span>
              <span
                style={{ cursor: 'pointer', color: '#00acac', fontSize: 18, lineHeight: 1 }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
              >
                ×
              </span>
            </div>

            {(
              [
                { label: '货主编号', value: pile.owner.ownerId },
                { label: '货主名称', value: pile.owner.ownerName },
                { label: '联系电话', value: pile.owner.phone },
                { label: '地址', value: pile.owner.address },
                { label: '备注', value: pile.owner.note },
              ] as { label: string; value: string | undefined }[]
            )
              .filter((item) => item.value)
              .map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    margin: '5px 0',
                    gap: 10,
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    paddingBottom: 4,
                  }}
                >
                  <span style={{ color: '#aaa', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {item.label}：
                  </span>
                  <span
                    style={{
                      color: '#00acac',
                      fontWeight: 'bold',
                      textAlign: 'right',
                      wordBreak: 'break-all',
                    }}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
          </div>
        </Html>
      )}
    </group>
  );
}

