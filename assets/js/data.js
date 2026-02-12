const appData = {
    categories: [
        { id: 'cafes', name: 'Cafés' },
        { id: 'chocolates', name: 'Chocolates' },
        { id: 'sobremesas', name: 'Sobremesas' },
        { id: 'gelados', name: 'Gelados' },
        { id: 'presentes', name: 'Presentes' }
    ],
    products: [
        // Cafés
        {
            id: 1,
            categoryId: 'cafes',
            name: 'Espresso Kop',
            description: 'O clássico café espresso Kopenhagen, encorpado e aromático.',
            price: 'R$ 9,90',
            image: 'https://placehold.co/400x400/1a1a1a/c6a87c?text=Espresso',
            featured: false
        },
        {
            id: 2,
            categoryId: 'cafes',
            name: 'Cappuccino Língua de Gato',
            description: 'Delicioso cappuccino com borda e pedaços de Língua de Gato.',
            price: 'R$ 22,90',
            image: 'https://placehold.co/400x300/1a1a1a/c6a87c?text=Cappuccino',
            featured: true
        },
        // Chocolates
        {
            id: 3,
            categoryId: 'chocolates',
            name: 'Nhá Benta Tradicional',
            description: 'Marshmallow macio coberto com chocolate ao leite Kopenhagen.',
            price: 'R$ 18,90',
            image: 'https://placehold.co/400x400/1a1a1a/c6a87c?text=Nha+Benta',
            featured: false
        },
        {
            id: 4,
            categoryId: 'chocolates',
            name: 'Língua de Gato',
            description: 'O clássico chocolate ao leite em formato único.',
            price: 'R$ 29,90',
            image: 'https://placehold.co/400x400/1a1a1a/c6a87c?text=Lingua+de+Gato',
            featured: false
        },
        // Sobremesas
        {
            id: 5,
            categoryId: 'sobremesas',
            name: 'Petit Gâteau',
            description: 'Bolo de chocolate quente com recheio cremoso e sorvete de creme.',
            price: 'R$ 34,90',
            image: 'https://placehold.co/400x300/1a1a1a/c6a87c?text=Petit+Gateau',
            featured: true
        },
        // Gelados
        {
            id: 6,
            categoryId: 'gelados',
            name: 'Milkshake Lajotinha',
            description: 'Milkshake cremoso sabor Lajotinha com chantilly.',
            price: 'R$ 28,90',
            image: 'https://placehold.co/400x400/1a1a1a/c6a87c?text=Milkshake',
            featured: false
        }
    ]
};
