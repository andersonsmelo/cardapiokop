-- 1. Inserir Categorias
INSERT INTO categories (name, slug, "order") VALUES
('Cafés', 'cafes', 0),
('Chocolates', 'chocolates', 1),
('Sobremesas', 'sobremesas', 2),
('Gelados', 'gelados', 3),
('Sodas', 'sodas', 4)
ON CONFLICT (slug) DO NOTHING;

-- 2. Inserir Produtos (Cafés)
INSERT INTO products (name, description, price, image_url, category_id, featured)
SELECT 'Café Expresso', 'Café expresso feito com grão arábica.', 'R$ 13,00', '/assets/img/espresso.webp', id, false FROM categories WHERE slug = 'cafes';

INSERT INTO products (name, description, price, image_url, category_id, featured)
SELECT 'Café Carioca', 'Café expresso menos intenso.', 'R$ 13,00', '/assets/img/placeholder_product.webp', id, false FROM categories WHERE slug = 'cafes';

INSERT INTO products (name, description, price, image_url, category_id, featured)
SELECT 'Café com Leite', 'Café expresso com leite vaporizado.', 'R$ 15,50', '/assets/img/placeholder_product.webp', id, false FROM categories WHERE slug = 'cafes';

INSERT INTO products (name, description, price, image_url, category_id, featured)
SELECT 'Canelinha', 'Café, leite vaporizado e canela em pó.', 'R$ 15,50', '/assets/img/placeholder_product.webp', id, false FROM categories WHERE slug = 'cafes';

INSERT INTO products (name, description, price, image_url, category_id, featured)
SELECT 'Cappuccino Tradicional', 'Café expresso com leite, chocolate em lascas, acompanhado de chantilly.', 'R$ 21,90', '/assets/img/capuccino_tradicional.webp', id, false FROM categories WHERE slug = 'cafes';

INSERT INTO products (name, description, price, image_url, category_id, featured)
SELECT 'Cappuccino Língua de Gato', 'Café expresso com leite e chocolate em lascas. Acompanha uma deliciosa Língua de Gato e chantilly.', 'R$ 26,50', '/assets/img/capuccino_lingua_de_gato.png', id, true FROM categories WHERE slug = 'cafes';

INSERT INTO products (name, description, price, image_url, category_id, featured)
SELECT 'Chocolate Quente', 'Chocolate quente saboroso feito a partir do melhor cacau.', 'R$ 16,50', '/assets/img/chocolate_quente.webp', id, false FROM categories WHERE slug = 'cafes';

INSERT INTO products (name, description, price, image_url, category_id, featured)
SELECT 'Chococcino', 'Bebida cremosa com leite vaporizado e lascas de chocolate ao leite.', 'R$ 21,90', '/assets/img/chococcino.webp', id, false FROM categories WHERE slug = 'cafes';

-- 3. Inserir Produtos (Chocolates)
INSERT INTO products (name, description, price, image_url, category_id, featured)
SELECT 'Nhá Benta Tradicional', 'Marshmallow macio coberto com chocolate ao leite Kopenhagen.', 'R$ 18,90', '/assets/img/nha_benta_tradicional.webp', id, false FROM categories WHERE slug = 'chocolates';

-- 4. Inserir Produtos (Sobremesas)
INSERT INTO products (name, description, price, image_url, category_id, featured)
SELECT 'Mousse de Chocolate', 'Mousse preparado com o nosso delicioso chocolate Kopenhagen. (130g)', 'R$ 27,50', '/assets/img/placeholder_product.webp', id, false FROM categories WHERE slug = 'sobremesas';

INSERT INTO products (name, description, price, image_url, category_id, featured)
SELECT 'Brownie com Sorvete', 'Brownie Kopenhagen com sorvete Kop Krema. (215g)', 'R$ 40,50', '/assets/img/placeholder_product.webp', id, true FROM categories WHERE slug = 'sobremesas';

INSERT INTO products (name, description, price, image_url, category_id, featured)
SELECT 'Nhá Benta S''mores', 'Nhá Benta com calda de chocolate, farofa de castanha e sorvete Kop Krema. (210g)', 'R$ 51,50', '/assets/img/placeholder_product.webp', id, true FROM categories WHERE slug = 'sobremesas';

INSERT INTO products (name, description, price, image_url, category_id, featured)
SELECT 'Affogato', 'Sorvete Kop Krema, café expresso e Língua de Gato. (200g)', 'R$ 32,90', '/assets/img/placeholder_product.webp', id, false FROM categories WHERE slug = 'sobremesas';


-- 5. Inserir Produtos (Gelados)
INSERT INTO products (name, description, price, image_url, category_id, featured)
SELECT 'Milkshake Língua de Gato', 'Baunilha, leite, chocolate ao leite, chantilly e Língua de Gato. (400ml)', 'R$ 39,50', '/assets/img/placeholder_product.webp', id, true FROM categories WHERE slug = 'gelados';

INSERT INTO products (name, description, price, image_url, category_id, featured)
SELECT 'Milkshake Pistache', 'Baunilha, trufa de pistache, creme de pistache e chantilly. (400ml)', 'R$ 39,50', '/assets/img/placeholder_product.webp', id, false FROM categories WHERE slug = 'gelados';

INSERT INTO products (name, description, price, image_url, category_id, featured)
SELECT 'Sundae Língua de Gato', 'Sorvete Kop Krema com calda de chocolate e Língua de Gato.', 'R$ 28,50', '/assets/img/placeholder_product.webp', id, false FROM categories WHERE slug = 'gelados';

INSERT INTO products (name, description, price, image_url, category_id, featured)
SELECT 'Kop Krema (Sorvete)', 'Sorvete cremoso Kopenhagen (Baunilha, Chocolate ou Misto). Sem nuts.', 'R$ 20,90', '/assets/img/placeholder_product.webp', id, false FROM categories WHERE slug = 'gelados';

-- 6. Inserir Produtos (Sodas)
INSERT INTO products (name, description, price, image_url, category_id, featured)
SELECT 'Soda Italiana', 'Sabores: Maçã verde, cranberry, limão siciliano ou pink lemonade. (400ml)', 'R$ 20,90', '/assets/img/placeholder_product.webp', id, false FROM categories WHERE slug = 'sodas';

INSERT INTO products (name, description, price, image_url, category_id, featured)
SELECT 'Iced Chococoffee', 'Café expresso, leite, chocolate ao leite, chantilly e gelo. (400ml)', 'R$ 32,90', '/assets/img/placeholder_product.webp', id, true FROM categories WHERE slug = 'sodas';

INSERT INTO products (name, description, price, image_url, category_id, featured)
SELECT 'Água', 'Com ou sem gás. (300ml)', 'R$ 9,90', '/assets/img/placeholder_product.webp', id, false FROM categories WHERE slug = 'sodas';
