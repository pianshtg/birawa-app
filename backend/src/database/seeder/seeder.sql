CREATE DATABASE IF NOT EXISTS birawa;
USE birawa;
CREATE TABLE roles (
    id CHAR(36) PRIMARY KEY,
    nama ENUM('admin', 'mitra'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL,
    created_by CHAR(36),
    updated_by CHAR(36)
);
CREATE TABLE permissions (
    id CHAR(36) PRIMARY KEY,
    role_id CHAR(36),
    nama VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL,
    created_by CHAR(36),
    updated_by CHAR(36),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE
    SET NULL
);
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY,
    email VARCHAR(100) UNIQUE,
    role_id CHAR(36),
    nama_lengkap VARCHAR(100),
    nomor_telepon VARCHAR(50),
    verification_token VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL,
    created_by CHAR(36),
    updated_by CHAR(36),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE
    SET NULL
);
CREATE TABLE mitra (
    id CHAR(36) PRIMARY KEY,
    nama VARCHAR(100),
    nomor_telepon VARCHAR(50),
    alamat VARCHAR(100),
    is_active TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL,
    created_by CHAR(36),
    updated_by CHAR(36)
);
CREATE TABLE mitra_users (
    id CHAR(36) PRIMARY KEY,
    mitra_id CHAR(36),
    user_id CHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL,
    created_by CHAR(36),
    updated_by CHAR(36),
    FOREIGN KEY (mitra_id) REFERENCES mitra(id) ON DELETE
    SET NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE
    SET NULL
);
CREATE TABLE users_hashed_password (
    user_id CHAR(36) PRIMARY KEY,
    hashed_password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL,
    created_by CHAR(36),
    updated_by CHAR(36),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE users_hashed_refresh_token (
    user_id CHAR(36) PRIMARY KEY,
    hashed_refresh_token VARCHAR(255),
    expires_at BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL,
    created_by CHAR(36),
    updated_by CHAR(36),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE inbox (
    id CHAR(36) PRIMARY KEY,
    sender_id CHAR(36),
    receiver_id CHAR(36),
    judul VARCHAR(100),
    isi VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL,
    created_by CHAR(36),
    updated_by CHAR(36),
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE
    SET NULL,
        FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE
    SET NULL
);
CREATE TABLE kontrak (
    id CHAR(36) PRIMARY KEY,
    mitra_id CHAR(36),
    nama VARCHAR(100),
    nomor VARCHAR(100),
    tanggal DATE,
    nilai INTEGER,
    jangka_waktu INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL,
    created_by CHAR(36),
    updated_by CHAR(36),
    FOREIGN KEY (mitra_id) REFERENCES mitra(id) ON DELETE
    SET NULL
);
CREATE TABLE kontrak_ss_pekerjaan (
    id CHAR(36) PRIMARY KEY,
    kontrak_id CHAR(36),
    nama VARCHAR(100),
    lokasi VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL,
    created_by CHAR(36),
    updated_by CHAR(36),
    FOREIGN KEY (kontrak_id) REFERENCES kontrak(id) ON DELETE
    SET NULL
);
CREATE TABLE shift (
    id CHAR(36) PRIMARY KEY,
    nama ENUM('1', '2'),
    waktu_mulai TIME,
    waktu_berakhir TIME,
    tanggal DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL,
    created_by CHAR(36),
    updated_by CHAR(36)
);
CREATE TABLE tipe_tenaga_kerja (
    id CHAR(36) PRIMARY KEY,
    nama ENUM('manajemen', 'lapangan'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL,
    created_by CHAR(36),
    updated_by CHAR(36)
);
CREATE TABLE peran_tenaga_kerja (
    id CHAR(36) PRIMARY KEY,
    tipe_tenaga_kerja_id CHAR(36),
    nama VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL,
    created_by CHAR(36),
    updated_by CHAR(36),
    FOREIGN KEY (tipe_tenaga_kerja_id) REFERENCES tipe_tenaga_kerja(id) ON DELETE
    SET NULL
);
CREATE TABLE tenaga_kerja (
    id CHAR(36) PRIMARY KEY,
    kontrak_ss_pekerjaan_id CHAR(36),
    shift_id CHAR(36),
    peran_tenaga_kerja_id CHAR(36),
    jumlah INTEGER,
    tanggal DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL,
    created_by CHAR(36),
    updated_by CHAR(36),
    FOREIGN KEY (kontrak_ss_pekerjaan_id) REFERENCES kontrak_ss_pekerjaan(id) ON DELETE
    SET NULL,
        FOREIGN KEY (shift_id) REFERENCES shift(id) ON DELETE
    SET NULL,
        FOREIGN KEY (peran_tenaga_kerja_id) REFERENCES peran_tenaga_kerja(id) ON DELETE
    SET NULL
);
CREATE TABLE tipe_aktivitas (
    id CHAR(36) PRIMARY KEY,
    nama VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL,
    created_by CHAR(36),
    updated_by CHAR(36)
);
CREATE TABLE aktivitas (
    id CHAR(36) PRIMARY KEY,
    kontrak_ss_pekerjaan_id CHAR(36),
    tipe_aktivitas_id CHAR(36),
    nama VARCHAR(100),
    tanggal DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL,
    created_by CHAR(36),
    updated_by CHAR(36),
    FOREIGN KEY (kontrak_ss_pekerjaan_id) REFERENCES kontrak_ss_pekerjaan(id) ON DELETE
    SET NULL,
        FOREIGN KEY (tipe_aktivitas_id) REFERENCES tipe_aktivitas(id) ON DELETE
    SET NULL
);
CREATE TABLE tipe_cuaca (
    id CHAR(36) PRIMARY KEY,
    nama ENUM('cerah', 'gerimis', 'hujan'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL,
    created_by CHAR(36),
    updated_by CHAR(36)
);
CREATE TABLE cuaca (
    id CHAR(36) PRIMARY KEY,
    kontrak_ss_pekerjaan_id CHAR(36),
    tipe_cuaca_id CHAR(36),
    waktu ENUM('pagi', 'siang', 'sore', 'malam'),
    waktu_mulai TIME DEFAULT NULL,
    waktu_berakhir TIME DEFAULT NULL,
    tanggal DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL,
    created_by CHAR(36),
    updated_by CHAR(36),
    FOREIGN KEY (kontrak_ss_pekerjaan_id) REFERENCES kontrak_ss_pekerjaan(id) ON DELETE
    SET NULL,
        FOREIGN KEY (tipe_cuaca_id) REFERENCES tipe_cuaca(id) ON DELETE
    SET NULL
);
CREATE TABLE dokumentasi (
    id CHAR(36) PRIMARY KEY,
    aktivitas_id CHAR(36),
    link VARCHAR(255),
    deskripsi VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL,
    created_by CHAR(36),
    updated_by CHAR(36),
    FOREIGN KEY (aktivitas_id) REFERENCES aktivitas(id) ON DELETE
    SET NULL
);
CREATE TABLE laporan (
    id CHAR(36) PRIMARY KEY,
    kontrak_id CHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL,
    created_by CHAR(36),
    updated_by CHAR(36),
    FOREIGN KEY (kontrak_id) REFERENCES kontrak(id) ON DELETE
    SET NULL
);
CREATE TABLE log (
    id CHAR(36) PRIMARY KEY,
    rekaman_id CHAR(36),
    user_id CHAR(36),
    nama_tabel VARCHAR(100),
    perubahan JSON,
    aksi ENUM('insert', 'update', 'delete'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- insert test
-- Insert data into roles
INSERT INTO roles (id, nama, created_by, updated_by)
VALUES (UUID(), 'admin', NULL, NULL),
    (UUID(), 'mitra', NULL, NULL);
-- Insert data into permission
INSERT INTO permissions (id, role_id, nama, created_by, updated_by)
VALUES (
        UUID(),
        (
            SELECT id
            FROM roles
            WHERE nama = 'admin'
        ),
        'manage_users',
        NULL,
        NULL
    ),
    (
        UUID(),
        (
            SELECT id
            FROM roles
            WHERE nama = 'admin'
        ),
        'view_reports',
        NULL,
        NULL
    ),
    (
        UUID(),
        (
            SELECT id
            FROM roles
            WHERE nama = 'mitra'
        ),
        'view_activities',
        NULL,
        NULL
    ),
    (
        UUID(),
        (
            SELECT id
            FROM roles
            WHERE nama = 'mitra'
        ),
        'update_profile',
        NULL,
        NULL
    ),
    (
        UUID(),
        (
            SELECT id
            FROM roles
            WHERE nama = 'mitra'
        ),
        'create_activity',
        NULL,
        NULL
    );
-- Insert data into users
INSERT INTO users (
        id,
        email,
        role_id,
        nama_lengkap,
        nomor_telepon,
        is_verified,
        created_by,
        updated_by
    )
VALUES (
        UUID(),
        'admin@example.com',
        (
            SELECT id
            FROM roles
            WHERE nama = 'admin'
        ),
        'Admin User',
        '081234567890',
        true,
        NULL,
        NULL
    ),
    (
        UUID(),
        'mitra1@example.com',
        (
            SELECT id
            FROM roles
            WHERE nama = 'mitra'
        ),
        'Mitra One',
        '081234567891',
        true,
        NULL,
        NULL
    ),
    (
        UUID(),
        'mitra2@example.com',
        (
            SELECT id
            FROM roles
            WHERE nama = 'mitra'
        ),
        'Mitra Two',
        '081234567892',
        true,
        NULL,
        NULL
    ),
    (
        UUID(),
        'mitra3@example.com',
        (
            SELECT id
            FROM roles
            WHERE nama = 'mitra'
        ),
        'Mitra Three',
        '081234567893',
        true,
        NULL,
        NULL
    ),
    (
        UUID(),
        'mitra4@example.com',
        (
            SELECT id
            FROM roles
            WHERE nama = 'mitra'
        ),
        'Mitra Four',
        '081234567894',
        true,
        NULL,
        NULL
    ),
    (
        UUID(),
        'mitra5@example.com',
        (
            SELECT id
            FROM roles
            WHERE nama = 'mitra'
        ),
        'Mitra Five',
        '081234567895',
        true,
        NULL,
        NULL
    ),
    (
        UUID(),
        'mitra6@example.com',
        (
            SELECT id
            FROM roles
            WHERE nama = 'mitra'
        ),
        'Mitra Six',
        '081234567896',
        true,
        NULL,
        NULL
    ),
    (
        UUID(),
        'mitra7@example.com',
        (
            SELECT id
            FROM roles
            WHERE nama = 'mitra'
        ),
        'Mitra Seven',
        '081234567897',
        true,
        NULL,
        NULL
    ),
    (
        UUID(),
        'mitra8@example.com',
        (
            SELECT id
            FROM roles
            WHERE nama = 'mitra'
        ),
        'Mitra Eight',
        '081234567898',
        true,
        NULL,
        NULL
    ),
    (
        UUID(),
        'mitra9@example.com',
        (
            SELECT id
            FROM roles
            WHERE nama = 'mitra'
        ),
        'Mitra Nine',
        '081234567899',
        true,
        NULL,
        NULL
    ),
    (
        UUID(),
        'mitra10@example.com',
        (
            SELECT id
            FROM roles
            WHERE nama = 'mitra'
        ),
        'Mitra Ten',
        '081234567991',
        true,
        NULL,
        NULL
    ),
    (
        UUID(),
        'mitra11@example.com',
        (
            SELECT id
            FROM roles
            WHERE nama = 'mitra'
        ),
        'Mitra Eleven',
        '081234567992',
        false,
        NULL,
        NULL
    ),
    (
        UUID(),
        'birawaprj@gmail.com',
        (
            SELECT id
            FROM roles
            WHERE nama = 'admin'
        ),
        'Admin Birawa',
        '081386039162',
        true,
        NULL,
        NULL
    );
-- Insert data into mitra
INSERT INTO mitra (
        id,
        nama,
        nomor_telepon,
        alamat,
        created_by,
        updated_by
    )
VALUES (
        UUID(),
        'Mitra Company One',
        '02134567890',
        'mitra_address_1',
        (
            SELECT id
            FROM users
            WHERE email = 'admin@example.com'
        ),
        NULL
    ),
    (
        UUID(),
        'Mitra Company Two',
        '02134567891',
        'mitra_address_2',
        (
            SELECT id
            FROM users
            WHERE email = 'admin@example.com'
        ),
        NULL
    ),
    (
        UUID(),
        'Mitra Company Three',
        '02134567892',
        'mitra_address_3',
        (
            SELECT id
            FROM users
            WHERE email = 'admin@example.com'
        ),
        NULL
    ),
    (
        UUID(),
        'Mitra Company Four',
        '02134567893',
        'mitra_address_4',
        (
            SELECT id
            FROM users
            WHERE email = 'admin@example.com'
        ),
        NULL
    ),
    (
        UUID(),
        'Mitra Company Five',
        '02134567894',
        'mitra_address_5',
        (
            SELECT id
            FROM users
            WHERE email = 'admin@example.com'
        ),
        NULL
    );
-- Insert data into mitra_users
INSERT INTO mitra_users (id, mitra_id, user_id, created_by, updated_by)
VALUES (
        UUID(),
        (
            SELECT id
            FROM mitra
            WHERE nama = 'Mitra Company One'
        ),
        (
            SELECT id
            FROM users
            WHERE email = 'mitra1@example.com'
        ),
        NULL,
        NULL
    ),
    (
        UUID(),
        (
            SELECT id
            FROM mitra
            WHERE nama = 'Mitra Company One'
        ),
        (
            SELECT id
            FROM users
            WHERE email = 'mitra2@example.com'
        ),
        NULL,
        NULL
    ),
    (
        UUID(),
        (
            SELECT id
            FROM mitra
            WHERE nama = 'Mitra Company Two'
        ),
        (
            SELECT id
            FROM users
            WHERE email = 'mitra3@example.com'
        ),
        NULL,
        NULL
    ),
    (
        UUID(),
        (
            SELECT id
            FROM mitra
            WHERE nama = 'Mitra Company Two'
        ),
        (
            SELECT id
            FROM users
            WHERE email = 'mitra4@example.com'
        ),
        NULL,
        NULL
    ),
    (
        UUID(),
        (
            SELECT id
            FROM mitra
            WHERE nama = 'Mitra Company Three'
        ),
        (
            SELECT id
            FROM users
            WHERE email = 'mitra5@example.com'
        ),
        NULL,
        NULL
    ),
    (
        UUID(),
        (
            SELECT id
            FROM mitra
            WHERE nama = 'Mitra Company Three'
        ),
        (
            SELECT id
            FROM users
            WHERE email = 'mitra6@example.com'
        ),
        NULL,
        NULL
    ),
    (
        UUID(),
        (
            SELECT id
            FROM mitra
            WHERE nama = 'Mitra Company Four'
        ),
        (
            SELECT id
            FROM users
            WHERE email = 'mitra7@example.com'
        ),
        NULL,
        NULL
    ),
    (
        UUID(),
        (
            SELECT id
            FROM mitra
            WHERE nama = 'Mitra Company Four'
        ),
        (
            SELECT id
            FROM users
            WHERE email = 'mitra8@example.com'
        ),
        NULL,
        NULL
    ),
    (
        UUID(),
        (
            SELECT id
            FROM mitra
            WHERE nama = 'Mitra Company Five'
        ),
        (
            SELECT id
            FROM users
            WHERE email = 'mitra9@example.com'
        ),
        NULL,
        NULL
    ),
    (
        UUID(),
        (
            SELECT id
            FROM mitra
            WHERE nama = 'Mitra Company Five'
        ),
        (
            SELECT id
            FROM users
            WHERE email = 'mitra10@example.com'
        ),
        NULL,
        NULL
    ),
    (
        UUID(),
        (
            SELECT id
            FROM mitra
            WHERE nama = 'Mitra Company Five'
        ),
        (
            SELECT id
            FROM users
            WHERE email = 'mitra11@example.com'
        ),
        NULL,
        NULL
    );
-- Insert data into users_hashed_password
INSERT INTO users_hashed_password (user_id, hashed_password, created_by, updated_by)
VALUES (
        (
            SELECT id
            FROM users
            WHERE email = 'admin@example.com'
        ),
        '43de1ba235f54e252d7be7a6f168e0aca3ad3a4d5db8a57dc1ccca83e907bc9fcf0bf2c38eb5f4f11e749ddeb133f4426989908b5861a10f42b5fb185ae9aa91',
        NULL,
        NULL
    ),
    (
        (
            SELECT id
            FROM users
            WHERE email = 'mitra1@example.com'
        ),
        '787915eba7b23de23e21f628dbb4c1571d2fa58be22d042fdcabb61df8e66c0f6bb10f3c4179a8ae55fd1e05959d48e9c68a4c8110f66f4a34dd65d9e9790bc7',
        NULL,
        NULL
    ),
    (
        (
            SELECT id
            FROM users
            WHERE email = 'mitra2@example.com'
        ),
        '1f9dc4e760d8bfcf514fb890b16053c2434d9cefd8b6f5a49ef63bd02b6e5e1d649d2826aa19abe0d255f0294b1fd6f2f30c01ac5988833caea05e829d79ed3f',
        NULL,
        NULL
    ),
    (
        (
            SELECT id
            FROM users
            WHERE email = 'mitra3@example.com'
        ),
        'bac80e54dba14db72d85921336efe09c88185c3beeac2574fb091674f2ec239053b2eb576bdea2bda027e6c57f397619afa7309329f2e10b35e32440ab0ed12b',
        NULL,
        NULL
    ),
    (
        (
            SELECT id
            FROM users
            WHERE email = 'mitra4@example.com'
        ),
        '04cc1c23de0ac379e5c9b6923819cefe640964630bf8a5fac31bc508590833973d1624c7dc4ccfc0409c668c7cbecc60a24211bbaae01ef86c171ad52e8efd25',
        NULL,
        NULL
    ),
    (
        (
            SELECT id
            FROM users
            WHERE email = 'mitra5@example.com'
        ),
        '4a18ec6e1841aea29ffd228c2741f92c4c75b02b09342c8fb6e323e8aed7f5a6afcbf65b203a10a58e8423c63f95c86c94345b2b9afac96411697e9b2201ecbc',
        NULL,
        NULL
    ),
    (
        (
            SELECT id
            FROM users
            WHERE email = 'mitra6@example.com'
        ),
        'd9f72fa86d13e4d9fec8914186d50a18bf584398b3295fcacde59a0b287804cdc6a2c426087f970fc80d62c866e22c15888883d895033d505fbeba7294677007',
        NULL,
        NULL
    ),
    (
        (
            SELECT id
            FROM users
            WHERE email = 'mitra7@example.com'
        ),
        '4deb9901dd55b7d649eea3340e6a0fdf27596acb50987f2d5595c51c230341c317a779699c2b6bbb208a3f9402a83fb9a20493bd5798296d7a17bf413a3f6dc5',
        NULL,
        NULL
    ),
    (
        (
            SELECT id
            FROM users
            WHERE email = 'mitra8@example.com'
        ),
        '502e6645ac134d5813754292a2a6808a10afa365c9f55d5160b20c67efe404b54d9ff2806bcd8f780ce42d838e812c2876bb26f065b4aa9b7e46e1be1654945d',
        NULL,
        NULL
    ),
    (
        (
            SELECT id
            FROM users
            WHERE email = 'mitra9@example.com'
        ),
        '8f8ff48485f6525a037179a6c9b1d3e287e8f783e934bbc74ad5b52379d7416ec732459ac745bbe6d410105853709f43db103afc334feaf728bc92995ac3b19c',
        NULL,
        NULL
    ),
    (
        (
            SELECT id
            FROM users
            WHERE email = 'mitra10@example.com'
        ),
        '51fec80b085818b4530dbdaa1af43b157166c1e08cd93258bf5890cd620a1c549dee337c27ebbc95ba731fc22d7d262f6bbb68169cc6c2fddcb68fb60ce13a6a',
        NULL,
        NULL
    ),
    (
        (
            SELECT id
            FROM users
            WHERE email = 'mitra11@example.com'
        ),
        '6298ef8cc45035d8633f2c0352d878eee3052ad2c702575e70fd18e52f839b0386732882d732f2b6a22fc08734434499a64e789de73ac0a68dff6607b481d699',
        NULL,
        NULL
    );
-- Insert data into users_hashed_refresh_token
INSERT INTO users_hashed_refresh_token (
        user_id,
        hashed_refresh_token,
        created_by,
        updated_by
    )
VALUES (
        (
            SELECT id
            FROM users
            WHERE email = 'admin@example.com'
        ),
        'c9e4bfc318283d47081f9c765df2ce2299fa0e8000c116bf067fad8af08b98a890fe02fd17dbd0e2b6fae586de89b6032a78750f8643cfed728be0595790c727',
        NULL,
        NULL
    ),
    (
        (
            SELECT id
            FROM users
            WHERE email = 'mitra1@example.com'
        ),
        '5fcec6d5a3e1ddcc18c06fef407e83ebf43f614072d9a3b6ba1dc253488ac4e6f869a25af3a5d62c243db606d7db8849fa7e70ef6247b62475fb33574d306222',
        NULL,
        NULL
    ),
    (
        (
            SELECT id
            FROM users
            WHERE email = 'mitra2@example.com'
        ),
        'e1c2a0527f2a649e886e7ab1cda30ac52b06db9f886783046e7a71963ca832411c96d4755c907eab1ef665a429693e8e5fa0f51be98f29379ac64e7aa0790f1b',
        NULL,
        NULL
    ),
    (
        (
            SELECT id
            FROM users
            WHERE email = 'mitra3@example.com'
        ),
        'f1548e14915648fd7d6ac752f29a5ac6fe31ed8e637e1b01170e4c7c919c11a91d290dae7b47e332aa53cd4bf99c85263ca3691220fab73f8d80096d11004f6e',
        NULL,
        NULL
    ),
    (
        (
            SELECT id
            FROM users
            WHERE email = 'mitra4@example.com'
        ),
        '423976b48927fef4981cfa0c60c3449cb00b8b5205ea312f45e97d076f575f1896491d20ed99f6f988de903070f0104e8f775c31611fabe5e3b575ae03624355',
        NULL,
        NULL
    ),
    (
        (
            SELECT id
            FROM users
            WHERE email = 'mitra5@example.com'
        ),
        '05faf0a0e78b7e9514d306df9cdfa37f400bb797d482dc5c0397a14b93a4bdda2d5e800c8c658a1985f6f5bae1ab5d3e0b726ba3528803de8ccc738f5e08557f',
        NULL,
        NULL
    ),
    (
        (
            SELECT id
            FROM users
            WHERE email = 'mitra6@example.com'
        ),
        '6a99139ff404724006c0f07ba2ee40fbb2d0b0aeb04b6314775bfe10dbe3d7483358e1161069fb558f8efc04a59ebd661b594364b9d60a4ee65d93b2be6e43c7',
        NULL,
        NULL
    ),
    (
        (
            SELECT id
            FROM users
            WHERE email = 'mitra7@example.com'
        ),
        '9af610bb4f990abc967b2ca448b6db5a244d97cad3ddd28e8bace9d8172e55bc28bde670e64a13c1348dff8e69b0a205ec93688b0a1a8565ce0588cca0f6d6ee',
        NULL,
        NULL
    ),
    (
        (
            SELECT id
            FROM users
            WHERE email = 'mitra8@example.com'
        ),
        '6bd8e036afad2421e05f6653c1d2e66a3781fb3ebd52bd44ef6c5a847353d0a23f0dcab11c21cb569c8b3259b6f1c767a7fbf0c24954f062aff65f95d762e277',
        NULL,
        NULL
    ),
    (
        (
            SELECT id
            FROM users
            WHERE email = 'mitra9@example.com'
        ),
        'ad37e63f7cf41d743cb06acbaa70b79a3f4ac72d03885b3534e9f785f00d6f008e1dc85a16cc659a025f20e2ed36758bf9f8f39c35f35b118e4b206f2be72d49',
        NULL,
        NULL
    ),
    (
        (
            SELECT id
            FROM users
            WHERE email = 'mitra10@example.com'
        ),
        '6131665896f5ea3cb572f8dd2bfe4901aad1ef99c01a82ce527ec2e1d26b38fd411b36bd1a3d3710f7057f3265d1deba315288102832e0972536168575e80708',
        NULL,
        NULL
    ),
    (
        (
            SELECT id
            FROM users
            WHERE email = 'mitra11@example.com'
        ),
        '916c37d19ecc7f5f4c37662ae8ea72fead796477d41b293d1445b759de5bc3dbb327338a90c20cd646e478517ddd6e526b4d2fc3ef28dfd780fdef3b10ea9cfc',
        NULL,
        NULL
    );
-- Insert data into inbox
INSERT INTO inbox (
        id,
        sender_id,
        receiver_id,
        judul,
        isi,
        created_by,
        updated_by
    )
VALUES (
        UUID(),
        (
            SELECT id
            FROM users
            WHERE email = 'admin@example.com'
        ),
        (
            SELECT id
            FROM users
            WHERE email = 'mitra1@example.com'
        ),
        'title_1',
        'content_1',
        NULL,
        NULL
    ),
    (
        UUID(),
        (
            SELECT id
            FROM users
            WHERE email = 'admin@example.com'
        ),
        (
            SELECT id
            FROM users
            WHERE email = 'mitra2@example.com'
        ),
        'title_2',
        'content_2',
        NULL,
        NULL
    ),
    (
        UUID(),
        (
            SELECT id
            FROM users
            WHERE email = 'admin@example.com'
        ),
        (
            SELECT id
            FROM users
            WHERE email = 'mitra3@example.com'
        ),
        'title_3',
        'content_3',
        NULL,
        NULL
    ),
    (
        UUID(),
        (
            SELECT id
            FROM users
            WHERE email = 'admin@example.com'
        ),
        (
            SELECT id
            FROM users
            WHERE email = 'mitra4@example.com'
        ),
        'title_4',
        'content_4',
        NULL,
        NULL
    ),
    (
        UUID(),
        (
            SELECT id
            FROM users
            WHERE email = 'admin@example.com'
        ),
        (
            SELECT id
            FROM users
            WHERE email = 'mitra5@example.com'
        ),
        'title_5',
        'content_5',
        NULL,
        NULL
    ),
    (
        UUID(),
        (
            SELECT id
            FROM users
            WHERE email = 'admin@example.com'
        ),
        (
            SELECT id
            FROM users
            WHERE email = 'mitra6@example.com'
        ),
        'title_6',
        'content_6',
        NULL,
        NULL
    ),
    (
        UUID(),
        (
            SELECT id
            FROM users
            WHERE email = 'admin@example.com'
        ),
        (
            SELECT id
            FROM users
            WHERE email = 'mitra7@example.com'
        ),
        'title_7',
        'content_7',
        NULL,
        NULL
    ),
    (
        UUID(),
        (
            SELECT id
            FROM users
            WHERE email = 'admin@example.com'
        ),
        (
            SELECT id
            FROM users
            WHERE email = 'mitra8@example.com'
        ),
        'title_8',
        'content_8',
        NULL,
        NULL
    ),
    (
        UUID(),
        (
            SELECT id
            FROM users
            WHERE email = 'admin@example.com'
        ),
        (
            SELECT id
            FROM users
            WHERE email = 'mitra9@example.com'
        ),
        'title_9',
        'content_9',
        NULL,
        NULL
    ),
    (
        UUID(),
        (
            SELECT id
            FROM users
            WHERE email = 'admin@example.com'
        ),
        (
            SELECT id
            FROM users
            WHERE email = 'mitra10@example.com'
        ),
        'title_10',
        'content_10',
        NULL,
        NULL
    ),
    (
        UUID(),
        (
            SELECT id
            FROM users
            WHERE email = 'admin@example.com'
        ),
        (
            SELECT id
            FROM users
            WHERE email = 'mitra11@example.com'
        ),
        'title_11',
        'content_11',
        NULL,
        NULL
    );
-- Insert data into kontrak
INSERT INTO kontrak (
        id,
        mitra_id,
        nama,
        nomor,
        tanggal,
        nilai,
        jangka_waktu,
        created_by,
        updated_by
    )
VALUES (
        UUID(),
        (
            SELECT id
            FROM mitra
            WHERE nama = 'Mitra Company One'
        ),
        'kontrak_1',
        '1',
        '2024-10-10',
        10000000,
        30,
        NULL,
        NULL
    ),
    (
        UUID(),
        (
            SELECT id
            FROM mitra
            WHERE nama = 'Mitra Company Two'
        ),
        'kontrak_2',
        '2',
        '2024-10-10',
        10000000,
        60,
        NULL,
        NULL
    ),
    (
        UUID(),
        (
            SELECT id
            FROM mitra
            WHERE nama = 'Mitra Company Three'
        ),
        'kontrak_3',
        '3',
        '2024-10-10',
        10000000,
        90,
        NULL,
        NULL
    ),
    (
        UUID(),
        (
            SELECT id
            FROM mitra
            WHERE nama = 'Mitra Company Four'
        ),
        'kontrak_4',
        '4',
        '2024-10-10',
        10000000,
        120,
        NULL,
        NULL
    ),
    (
        UUID(),
        (
            SELECT id
            FROM mitra
            WHERE nama = 'Mitra Company Five'
        ),
        'kontrak_5',
        '5',
        '2024-10-10',
        10000000,
        180,
        NULL,
        NULL
    );
-- Insert data into kontrak_ss_pekerjaan
INSERT INTO kontrak_ss_pekerjaan (
        id,
        kontrak_id,
        nama,
        lokasi,
        created_by,
        updated_by
    )
VALUES (
        UUID(),
        (
            SELECT id
            FROM kontrak
            WHERE nomor = '1'
        ),
        'pekerjaan_1',
        'lokasi_1',
        NULL,
        NULL
    ),
    (
        UUID(),
        (
            SELECT id
            FROM kontrak
            WHERE nomor = '1'
        ),
        'pekerjaan_2',
        'lokasi_2',
        NULL,
        NULL
    ),
    (
        UUID(),
        (
            SELECT id
            FROM kontrak
            WHERE nomor = '1'
        ),
        'pekerjaan_3',
        'lokasi_3',
        NULL,
        NULL
    );
-- Insert data into shift
INSERT INTO shift (
        id,
        nama,
        waktu_mulai,
        waktu_berakhir,
        tanggal,
        created_by,
        updated_by
    )
VALUES (
        UUID(),
        '1',
        '08:00:00',
        '16:00:00',
        '2024-10-10',
        NULL,
        NULL
    ),
    (
        UUID(),
        '2',
        '16:00:00',
        '00:00:00',
        '2024-10-10',
        NULL,
        NULL
    );
-- Insert data into tipe_tenaga_kerja
INSERT INTO tipe_tenaga_kerja (id, nama, created_by, updated_by)
VALUES (UUID(), 'manajemen', NULL, NULL),
    (UUID(), 'lapangan', NULL, NULL);
-- Insert data into peran_tenaga_kerja
INSERT INTO peran_tenaga_kerja (
        id,
        tipe_tenaga_kerja_id,
        nama,
        created_by,
        updated_by
    )
VALUES (
        UUID(),
        (
            SELECT id
            FROM tipe_tenaga_kerja
            WHERE nama = 'manajemen'
        ),
        'Project Manager',
        NULL,
        NULL
    ),
    (
        UUID(),
        (
            SELECT id
            FROM tipe_tenaga_kerja
            WHERE nama = 'manajemen'
        ),
        'Site Manager',
        NULL,
        NULL
    ),
    (
        UUID(),
        (
            SELECT id
            FROM tipe_tenaga_kerja
            WHERE nama = 'lapangan'
        ),
        'Pekerja Sipil',
        NULL,
        NULL
    ),
    (
        UUID(),
        (
            SELECT id
            FROM tipe_tenaga_kerja
            WHERE nama = 'lapangan'
        ),
        'Pekerja Arsitektur',
        NULL,
        NULL
    ),
    (
        UUID(),
        (
            SELECT id
            FROM tipe_tenaga_kerja
            WHERE nama = 'lapangan'
        ),
        'Pekerja Mekanikal Elektrik',
        NULL,
        NULL
    );
-- Insert data into tenaga_kerja
INSERT INTO tenaga_kerja (
        id,
        kontrak_ss_pekerjaan_id,
        shift_id,
        peran_tenaga_kerja_id,
        jumlah,
        tanggal,
        created_by,
        updated_by
    )
VALUES (
        UUID(),
        (
            SELECT id
            FROM kontrak_ss_pekerjaan
            WHERE nama = 'pekerjaan_1'
        ),
        (
            SELECT id
            FROM shift
            WHERE tanggal = '2024-10-10'
                AND nama = '1'
        ),
        (
            SELECT id
            FROM peran_tenaga_kerja
            WHERE nama = 'Project Manager'
        ),
        1,
        '2024-10-10',
        NULL,
        NULL
    ),
    (
        UUID(),
        (
            SELECT id
            FROM kontrak_ss_pekerjaan
            WHERE nama = 'pekerjaan_1'
        ),
        (
            SELECT id
            FROM shift
            WHERE tanggal = '2024-10-10'
                AND nama = '2'
        ),
        (
            SELECT id
            FROM peran_tenaga_kerja
            WHERE nama = 'Site Manager'
        ),
        2,
        '2024-10-10',
        NULL,
        NULL
    ),
    (
        UUID(),
        (
            SELECT id
            FROM kontrak_ss_pekerjaan
            WHERE nama = 'pekerjaan_2'
        ),
        (
            SELECT id
            FROM shift
            WHERE tanggal = '2024-10-10'
                AND nama = '1'
        ),
        (
            SELECT id
            FROM peran_tenaga_kerja
            WHERE nama = 'Pekerja Sipil'
        ),
        3,
        '2024-10-10',
        NULL,
        NULL
    ),
    (
        UUID(),
        (
            SELECT id
            FROM kontrak_ss_pekerjaan
            WHERE nama = 'pekerjaan_2'
        ),
        (
            SELECT id
            FROM shift
            WHERE tanggal = '2024-10-10'
                AND nama = '1'
        ),
        (
            SELECT id
            FROM peran_tenaga_kerja
            WHERE nama = 'Project Arsitektur'
        ),
        4,
        '2024-10-10',
        NULL,
        NULL
    ),
    (
        UUID(),
        (
            SELECT id
            FROM kontrak_ss_pekerjaan
            WHERE nama = 'pekerjaan_2'
        ),
        (
            SELECT id
            FROM shift
            WHERE tanggal = '2024-10-10'
                AND nama = '2'
        ),
        (
            SELECT id
            FROM peran_tenaga_kerja
            WHERE nama = 'Project Mekanikal Elektrik'
        ),
        5,
        '2024-10-10',
        NULL,
        NULL
    );
-- Insert data into tipe_aktivitas
INSERT INTO tipe_aktivitas (id, nama, created_by, updated_by)
VALUES (UUID(), 'Pekerjaan Sipil', NULL, NULL),
    (UUID(), 'Pekerjaan Arsitektur', NULL, NULL),
    (
        UUID(),
        'Pekerjaan Mekanikal Elektrik',
        NULL,
        NULL
    ),
    (UUID(), 'Pekerjaan Furniture', NULL, NULL);
-- Insert data into aktivitas
INSERT INTO aktivitas (
        id,
        kontrak_ss_pekerjaan_id,
        tipe_aktivitas_id,
        nama,
        tanggal,
        created_by,
        updated_by
    )
VALUES (
        UUID(),
        (
            SELECT id
            FROM kontrak_ss_pekerjaan
            WHERE nama = 'pekerjaan_1'
        ),
        (
            SELECT id
            FROM tipe_aktivitas
            WHERE nama = 'Pekerjaan Mekanikal Elektrik'
        ),
        'aktivitas_1',
        '2024-10-10',
        NULL,
        NULL
    ),
    (
        UUID(),
        (
            SELECT id
            FROM kontrak_ss_pekerjaan
            WHERE nama = 'pekerjaan_1'
        ),
        (
            SELECT id
            FROM tipe_aktivitas
            WHERE nama = 'Pekerjaan Mekanikal Elektrik'
        ),
        'aktivitas_2',
        '2024-10-10',
        NULL,
        NULL
    ),
    (
        UUID(),
        (
            SELECT id
            FROM kontrak_ss_pekerjaan
            WHERE nama = 'pekerjaan_1'
        ),
        (
            SELECT id
            FROM tipe_aktivitas
            WHERE nama = 'Pekerjaan Mekanikal Elektrik'
        ),
        'aktivitas_3',
        '2024-10-10',
        NULL,
        NULL
    );
-- Insert data into tipe_cuaca
INSERT INTO tipe_cuaca (id, nama, created_by, updated_by)
VALUES (UUID(), 'cerah', NULL, NULL),
    (UUID(), 'gerimis', NULL, NULL),
    (UUID(), 'hujan', NULL, NULL);
-- Insert data into cuaca
INSERT INTO cuaca (
        id,
        kontrak_ss_pekerjaan_id,
        tipe_cuaca_id,
        waktu,
        waktu_mulai,
        waktu_berakhir,
        tanggal,
        created_by,
        updated_by
    )
VALUES (
        UUID(),
        (
            SELECT id
            FROM kontrak_ss_pekerjaan
            WHERE nama = 'pekerjaan_1'
        ),
        (
            SELECT id
            FROM tipe_cuaca
            WHERE nama = 'cerah'
        ),
        'pagi',
        NULL,
        NULL,
        '2024-10-10',
        NULL,
        NULL
    ),
    (
        UUID(),
        (
            SELECT id
            FROM kontrak_ss_pekerjaan
            WHERE nama = 'pekerjaan_1'
        ),
        (
            SELECT id
            FROM tipe_cuaca
            WHERE nama = 'cerah'
        ),
        'siang',
        NULL,
        NULL,
        '2024-10-10',
        NULL,
        NULL
    ),
    (
        UUID(),
        (
            SELECT id
            FROM kontrak_ss_pekerjaan
            WHERE nama = 'pekerjaan_1'
        ),
        (
            SELECT id
            FROM tipe_cuaca
            WHERE nama = 'gerimis'
        ),
        'sore',
        '15:00:00',
        '15:30:00',
        '2024-10-10',
        NULL,
        NULL
    ),
    (
        UUID(),
        (
            SELECT id
            FROM kontrak_ss_pekerjaan
            WHERE nama = 'pekerjaan_1'
        ),
        (
            SELECT id
            FROM tipe_cuaca
            WHERE nama = 'hujan'
        ),
        'malam',
        '18:00:00',
        '21:00:00',
        '2024-10-10',
        NULL,
        NULL
    );
-- Insert data into dokumentasi
INSERT INTO dokumentasi (
        id,
        aktivitas_id,
        link,
        deskripsi,
        created_by,
        updated_by
    )
VALUES (
        UUID(),
        (
            SELECT id
            FROM aktivitas
            WHERE nama = 'aktivitas_1'
        ),
        'https://www.youtube.com/watch?v=d9aTL0_T_sI',
        'dokumentasi_1_before',
        NULL,
        NULL
    ),
    (
        UUID(),
        (
            SELECT id
            FROM aktivitas
            WHERE nama = 'aktivitas_1'
        ),
        'https://www.youtube.com/watch?v=d9aTL0_T_sI',
        'dokumentasi_1_after',
        NULL,
        NULL
    ),
    (
        UUID(),
        (
            SELECT id
            FROM aktivitas
            WHERE nama = 'aktivitas_2'
        ),
        'https://www.youtube.com/watch?v=d9aTL0_T_sI',
        'dokumentasi_2_before',
        NULL,
        NULL
    ),
    (
        UUID(),
        (
            SELECT id
            FROM aktivitas
            WHERE nama = 'aktivitas_2'
        ),
        'https://www.youtube.com/watch?v=d9aTL0_T_sI',
        'dokumentasi_2_after',
        NULL,
        NULL
    ),
    (
        UUID(),
        (
            SELECT id
            FROM aktivitas
            WHERE nama = 'aktivitas_3'
        ),
        'https://www.youtube.com/watch?v=d9aTL0_T_sI',
        'dokumentasi_3_before',
        NULL,
        NULL
    ),
    (
        UUID(),
        (
            SELECT id
            FROM aktivitas
            WHERE nama = 'aktivitas_3'
        ),
        'https://www.youtube.com/watch?v=d9aTL0_T_sI',
        'dokumentasi_3_after',
        NULL,
        NULL
    );
-- Insert data into laporan
INSERT INTO laporan (id, kontrak_id, created_by, updated_by)
VALUES (
        UUID(),
        (
            SELECT id
            FROM kontrak
            WHERE nomor = '1'
        ),
        NULL,
        NULL
    );
-- Insert data into log
INSERT INTO log (
        id,
        rekaman_id,
        user_id,
        nama_tabel,
        perubahan,
        aksi
    )
VALUES (
        UUID(),
        UUID(),
        (
            SELECT id
            FROM users
            WHERE email = 'admin@example.com'
        ),
        'tenaga_kerja',
        '{"before": {"jumlah":1}, "after": {"jumlah":2}}',
        'update'
    );