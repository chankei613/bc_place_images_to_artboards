var doc = app.activeDocument;

// Select multiple images
var files = File.openDialog("Select images to place", "*.jpg;*.png;*.gif;*.tif;*.bmp;*.jpeg", true);

if (files) {
    // Enter artboard numbers (example: 1,3,5)
    var input = prompt("Enter the artboard numbers separated by commas.\n(e.g., 1,3,5)", "");

    if (input && input !== "") {
        var parts = input.split(",");
        var indices = [];
        for (var k = 0; k < parts.length; k++) {
            var num = parseInt(parts[k], 10) - 1; // Convert to 0-based
            if (!isNaN(num)) {
                indices.push(num);
            }
        }

        for (var j = 0; j < indices.length && j < files.length; j++) {
            var i = indices[j];
            if (i < 0 || i >= doc.artboards.length) {
                alert("Artboard number " + (i+1) + " does not exist.");
                continue;
            }

            // Get artboard bounds
            var abBounds = doc.artboards[i].artboardRect;
            var abWidth  = abBounds[2] - abBounds[0];
            var abHeight = abBounds[1] - abBounds[3];

            // Subtract 10px margin
            var targetWidth  = abWidth  - 10;
            var targetHeight = abHeight - 10;

            // Place image
            var placed = doc.placedItems.add();
            placed.file = files[j];

            // Scale to fit (maintain aspect ratio)
            var scaleX = (targetWidth  / placed.width)  * 100;
            var scaleY = (targetHeight / placed.height) * 100;
            var scale = Math.min(scaleX, scaleY);

            placed.width  = placed.width  * (scale / 100);
            placed.height = placed.height * (scale / 100);

            // Center position
            var abCenterX = (abBounds[0] + abBounds[2]) / 2;
            var abCenterY = (abBounds[1] + abBounds[3]) / 2;
            placed.position = [
                abCenterX - placed.width  / 2,
                abCenterY + placed.height / 2
            ];
        }
    }
}
