USE quantix_db;

INSERT INTO user_roles (role_name, description) VALUES
('NAS', 'Non-Academic Scholar - handles inventory transactions'),
('COORDINATOR', 'Laboratory Coordinator - manages equipment and monitors activities')
ON DUPLICATE KEY UPDATE role_name = role_name;

SELECT * FROM user_roles;