document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('userForm');
    const userIdInput = document.getElementById('userId');
    const userNameInput = document.getElementById('userName');
    const userEmailInput = document.getElementById('userEmail');
    const userAddressInput = document.getElementById('userAddress');
    const userPhoneInput = document.getElementById('userPhone');
    const userUsernameInput = document.getElementById('userUsername');
    const userPasswordInput = document.getElementById('userPassword');
    const userList = document.getElementById('userList');

    // Função para listar usuários
    function listUsers() {
        fetch('http://localhost:3000/api/users')
            .then(response => response.json())
            .then(users => {
                userList.innerHTML = '';
                users.forEach(user => {
                    const li = document.createElement('li');
                    li.innerHTML = `${user.name} (${user.email}, ${user.address}, ${user.phone}, Usuário: ${user.username}) 
                        <button onclick="editUser(${user.id})">Editar</button> 
                        <button onclick="deleteUser(${user.id})">Excluir</button>`;
                    userList.appendChild(li);
                });
            });
    }

    // Função para salvar ou atualizar usuário
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const id = userIdInput.value;
        const name = userNameInput.value;
        const email = userEmailInput.value;
        const address = userAddressInput.value;
        const phone = userPhoneInput.value;
        const username = userUsernameInput.value;
        const password = userPasswordInput.value;

        if (!name || !email || !address || !phone || !username || !password) {
            alert('Todos os campos são obrigatórios!');
            return;
        }

        const userData = { name, email, address, phone, username, password };

        if (id) {
            // Atualizar usuário
            fetch(`http://localhost:3000/api/users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            })
                .then(response => response.json())
                .then(() => {
                    listUsers();
                    form.reset();
                    userIdInput.value = '';
                });
        } else {
            // Criar novo usuário
            fetch('http://localhost:3000/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            })
                .then(response => response.json())
                .then(() => {
                    listUsers();
                    form.reset();
                });
        }
    });

    // Função para editar usuário
    window.editUser = function (id) {
        fetch(`http://localhost:3000/api/users/${id}`)
            .then(response => response.json())
            .then(user => {
                userIdInput.value = user.id;
                userNameInput.value = user.name;
                userEmailInput.value = user.email;
                userAddressInput.value = user.address;
                userPhoneInput.value = user.phone;
                userUsernameInput.value = user.username;
                userPasswordInput.value = user.password; // Preencher para edição
            });
    };

    // Função para excluir usuário
    window.deleteUser = function (id) {
        fetch(`http://localhost:3000/api/users/${id}`, {
            method: 'DELETE',
        })
            .then(() => {
                listUsers();
            });
    };

    // Carregar usuários inicialmente
    listUsers();
});
