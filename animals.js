export async function getAnimalBodyFromImage(x, y, imagePath) {
    let img = new Image();
    img.src = imagePath;
    await img.decode();

    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    let vertices = [];
    let imageData = ctx.getImageData(0, 0, img.width, img.height);
    let threshold = 128;

    for (let y = 0; y < img.height; y++) {
        for (let x = 0; x < img.width; x++) {
            let index = (y * img.width + x) * 4;
            let alpha = imageData.data[index + 3];
            if (alpha > threshold) {
                vertices.push({ x: x - img.width / 2, y: y - img.height / 2 });
            }
        }
    }

    // ✅ **画像サイズを縮小**
    let scaleFactor = 1.0; // **縮小率（0.3 = 30%サイズ）**
    vertices = vertices.map(v => ({ x: v.x * scaleFactor, y: v.y * scaleFactor }));

    return Matter.Bodies.fromVertices(x, y, [vertices], {
        restitution: 0.1,
        render: {
            sprite: {
                texture: imagePath,
                xScale: scaleFactor, // ✅ **画像の幅を縮小**
                yScale: scaleFactor  // ✅ **画像の高さを縮小**
            }
        }
    });
}
