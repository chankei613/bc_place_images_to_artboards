var doc = app.activeDocument;

// 複数の画像を選択
var files = File.openDialog("配置する画像を選んでください", "*.jpg;*.png;*.gif;*.tif;*.bmp;*.jpeg", true);

if (files) {
    // アートボード番号を入力（例: 1,3,5）
    var input = prompt("配置したいアートボード番号をカンマ区切りで入力してください。\n（例: 1,3,5）", "");

    if (input && input !== "") {
        var parts = input.split(",");
        var indices = [];
        for (var k = 0; k < parts.length; k++) {
            var num = parseInt(parts[k], 10) - 1; // 1始まりを0始まりに変換
            if (!isNaN(num)) {
                indices.push(num);
            }
        }

        for (var j = 0; j < indices.length && j < files.length; j++) {
            var i = indices[j];
            if (i < 0 || i >= doc.artboards.length) {
                alert("アートボード番号 " + (i+1) + " は存在しません。");
                continue;
            }

            // アートボード情報を取得
            var abBounds = doc.artboards[i].artboardRect;
            var abWidth  = abBounds[2] - abBounds[0];
            var abHeight = abBounds[1] - abBounds[3];

            // 10px マージンを引いた領域
            var targetWidth  = abWidth  - 10;
            var targetHeight = abHeight - 10;

            // 画像を配置
            var placed = doc.placedItems.add();
            placed.file = files[j];

            // 縦横比を維持してスケーリング
            var scaleX = (targetWidth  / placed.width)  * 100;
            var scaleY = (targetHeight / placed.height) * 100;
            var scale = Math.min(scaleX, scaleY);

            placed.width  = placed.width  * (scale / 100);
            placed.height = placed.height * (scale / 100);

            // 中央に配置
            var abCenterX = (abBounds[0] + abBounds[2]) / 2;
            var abCenterY = (abBounds[1] + abBounds[3]) / 2;
            placed.position = [
                abCenterX - placed.width  / 2,
                abCenterY + placed.height / 2
            ];
        }
    }
}
