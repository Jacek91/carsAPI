$(function () {

    const baseUrl = 'http://localhost:3000';
    const $list = $('.cars_list');

    function createElement(car) {
        const $li = $('<li class="list-group-item"/>');
        $li.append(`<h3>${car.brand}</h3>`);
        $li.append(`<p>${car.name}</p>`);
        $li.attr('data-id', car.id);
        $li.attr('data-edit', false);
        $li.append('<button type="submit" id="deleteBtn" class="btn btn-primary"> Delete </button>')
        $li.append('<button type="submit" id="editBtn" class="btn btn-info"> Edit </button>')
        $list.append($li);
    }

    function displayCar() {
        $.ajax({
            method: 'GET',
            url: `${baseUrl}/cars`,
            dataType: 'json'
        }).done(function (response) {
            response.forEach(createElement);
        }).fail(function (error) {
            alert('Error!!!');
        });
    }

    function addCar() {
        $('.btn-secondary').on('click', function (evt) {
            evt.preventDefault();
            let newCar = {}
            newCar.id = Math.floor(Math.random() * 1000);
            newCar.name = $('.get_name').val();
            newCar.brand = $('.get_brand').val();
            $.ajax({
                method: 'POST',
                url: `${baseUrl}/cars`,
                dataType: 'json',
                data: newCar
            }).done(function (response) {
                createElement(newCar)
            }).fail(function (error) {
                alert('Error!!!');
            });
        })

    }

    function removeCar() {
        $('.list-group').on('click', '#deleteBtn', function (evt) {
            evt.preventDefault();
            let $parent = $(this).parent();
            let $carId = $parent.data('id');
            $.ajax({
                    method: "DELETE",
                    url: `${baseUrl}/cars/${$carId}`,
                    dataType: "json",
                })
                .done(function (response) {
                    $parent.remove();
                }).fail(function (error) {
                    alert('Error!!!');
                });
        })
    }

    function updateCar() {
        $('.list-group').on('click', '#editBtn', function () {
            let $this = $(this);
            let $parent = $(this).parent();
            let $carBrand = $parent.find('h3');
            let $carName = $parent.find('p');
            let $carId = $parent.data('id');
            let $isEditing = $parent.data('edit');
            if (!$isEditing) {
                $parent.data('edit', true);
                $carBrand.attr('contenteditable', true);
                $carName.attr('contenteditable', true);
                $this.text('Confirm');
            } else {
                var carUpdate = {
                    name: $carName.text(),
                    brand: $carBrand.text()

                }
                $.ajax({
                    url: `${baseUrl}/cars/${$carId}`,
                    method: 'PATCH',
                    data: carUpdate,
                    dataType: 'json'
                }).done(function (response) {
                    $this.text('edit');
                    $parent.data('edit', false);
                    $carName.attr('contenteditable', false);
                    $carBrand.attr('contenteditable', false);
                }).fail(function (error) {
                    alert('Error!!!');
                });
            };
        })
    }

    displayCar();
    addCar();
    removeCar();
    updateCar();
})