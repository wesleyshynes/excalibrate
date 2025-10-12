const rotationMatrix = [
    [315, 0, 45],
    [270, 0, 90],
    [225, 180, 135],
]

export const rotationMatrixRad = rotationMatrix.map(row => row.map(deg => deg * (Math.PI / 180)));