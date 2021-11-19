
let colors = ['0055ff','00FF00','B8860B']

const count = colors.length;
let inc = 100/count;
let formula = 'linear-gradient(45deg, ';

// build color string for gradient
var i = 0;
while (i < count) {
    formula += '#' + colors[i];
    if (i < count-1){
     formula += ', '
    }
    i++
}

formula += ')';
console.log(formula);
