
let cells = []; //хранит коллекцию ячеек
var dragSrcEl;  //отвечает за перетаскивания
let canvas, ctx, speed = 4, textX = 220;

window.onload = function() //загрузка ресурсов
{
    let size = 4;
  document.getElementById('fieldSize').addEventListener('input', function()  //Возвращает ссылку на элемент по его ID 
  {
    size = this.value;
   })
    document.getElementById('generateField').addEventListener('click', function(){createField(size)}); //Возвращает ссылку на элемент по его ID
    canvas = document.getElementById('myCanvas');
    ctx = canvas.getContext('2d');
};

function createField(n) {              //Создание поля в классе
    let table = document.getElementById('myTable');
    table.innerHTML = "";
    cells = [];
    let row, cell;
    let counter = 0;
    let initialArr = [];
    const mainArr = [];

    for (let i = 1; i < n*n; i++){
        initialArr.push(i);
        mainArr.push(i);
    }
    mixArr(initialArr);
    console.log(initialArr);

    for (let i = 0; i < n; i++) {
        row = table.insertRow(i);
        for(let j = 0; j < n; j ++){
            cell = row.insertCell(j);
            cell.addEventListener('dragstart', handleDragStart, false);
            if (counter < initialArr.length)
            {
                cell.innerHTML = '<div class="item" draggable="true"' + ' id="' + initialArr[counter] + '">'+initialArr[counter] + '</div>';
            } else {
                cell.addEventListener('dragover', handleDragOver, false);
                cell.addEventListener('drop', handleDrop, false);
            }
            cells[counter] = initialArr[counter];
            counter++;
        }
    }
    cells[n*n - 1] = 'empty';
    console.log(cells);

}

function mixArr(arr){       // случайным образом  получаем исходный массив arr
    let randIndex;
    for (let i in arr) {
      let x = arr[i];
        randIndex = Math.floor(Math.random() * arr.length);
        arr[i] = arr[randIndex];
        arr[randIndex] = x;
        
    }
}

function handleDragStart(e) {  //функция перетаскивания

    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }

    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDrop(e) {

    if (e.stopPropagation) {
        e.stopPropagation(); // Прекращение дальнейшей передачи текущего события
    }

    if (dragSrcEl != this) { //Не делаем ничего,если отбрасываем ту же ячейку,которую перетаскиваем

        let x = parseInt(dragSrcEl.innerText); // меняем поля в массиве, по которому происходит проверка на выигрышь
        let index = cells.indexOf(x);

        cells[cells.indexOf('empty')] = x;
        cells[index] = 'empty';
        if (won(cells)){
            requestAnimationFrame(animate);
            console.log( "You won!");
        } else {
            console.log("keep trying");
        }
      
        dragSrcEl.innerHTML = this.innerHTML;   // обмен содержимого полей которое переносим и на которое переносим
        dragSrcEl.addEventListener('dragover', handleDragOver, false);
        dragSrcEl.addEventListener('drop', handleDrop, false);

        this.innerHTML = e.dataTransfer.getData('text/html');
        this.removeEventListener('dragover', handleDragOver, false);
        this.removeEventListener('drop', handleDrop, false);
    }
    return false;
}

function won(arr) { // Проверка выиграл ли игрок
    if (arr[arr.length - 1] !== "empty") return;
    for (let i = 0; i < arr.length - 1; i++){
        if (i + 1 == arr[i]){ continue; }
        else { return false;}
    }
    return true;
}

function animate(){ // Анимация после победы
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#CC0013';
    ctx.font = '40pt Arial';
    ctx.fillText('Победа!', textX, 100, 500);
    ctx.fillStyle = 'red';
    ctx.strokeText('Победа!', textX, 100, 500);

   
    requestAnimationFrame(animate);
    
}