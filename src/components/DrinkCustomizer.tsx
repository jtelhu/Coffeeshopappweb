import { useState } from 'react';
import { DrinkItem, CustomizationOptions } from '../App';
import { X, Plus, Minus } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface DrinkCustomizerProps {
  drink: DrinkItem;
  onAddToCart: (customization: CustomizationOptions) => void;
  onCancel: () => void;
}

const milkOptions = ['Whole Milk', '2% Milk', 'Oat Milk', 'Almond Milk', 'Soy Milk', 'Coconut Milk'];
const extraOptions = ['Espresso Shot', 'Vanilla Syrup', 'Caramel Drizzle', 'Whipped Cream', 'Cinnamon'];
const coffeeStrengthOptions = ['Light', 'Regular', 'Strong'];
const flavorOptions = ['None', 'Vanilla', 'Caramel', 'Hazelnut'];
const toppingOptions = ['None', 'Chocolate Chips', 'Sprinkles', 'Whipped Cream'];
const drizzleOptions = ['None', 'Vanilla', 'Caramel', 'Hazelnut'];

export function DrinkCustomizer({ drink, onAddToCart, onCancel }: DrinkCustomizerProps) {
  const [customization, setCustomization] = useState<CustomizationOptions>({
    size: 'Medium',
    milk: 'Whole Milk',
    sweetness: 50,
    ice: 'Regular Ice',
    extras: [],
    temperature: 'Hot',
    coffeeStrength: 'Regular',
    flavor: 'None',
    topping: 'None',
    drizzle: 'None',
  });

  const isSnack = drink.category === 'Snacks';

  const toggleExtra = (extra: string) => {
    setCustomization(prev => ({
      ...prev,
      extras: prev.extras.includes(extra)
        ? prev.extras.filter(e => e !== extra)
        : [...prev.extras, extra],
    }));
  };

  const calculatePrice = () => {
    let price = drink.price;
    // Only add size charges for drinks, not snacks
    if (!isSnack) {
      if (customization.size === 'Medium') price += 0.5;
      if (customization.size === 'Large') price += 1.0;
    }
    price += customization.extras.length * 0.5;
    return price;
  };

  const selectedClass = 'border-[#d60000] bg-[rgba(214,0,0,0.1)] text-[#d60000]';
  const unselectedClass = 'border-[rgba(0,5,0,0.2)] bg-[#fafaff] text-[#000500]';

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fafaff' }}>
      {/* Header */}
      <div className="sticky top-16 border-b p-4 flex items-center justify-between z-10" style={{ 
        backgroundColor: '#fafaff',
        borderColor: 'rgba(0, 5, 0, 0.1)'
      }}>
        <h2 style={{ color: '#000500' }}>{isSnack ? 'Customize Snack' : 'Customize Drink'}</h2>
        <button 
          onClick={onCancel} 
          className="p-2 rounded-full transition-colors"
          style={{ backgroundColor: 'transparent' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 5, 0, 0.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <X className="w-6 h-6" style={{ color: '#000500' }} />
        </button>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
          {/* Left Column - Image & Info */}
          <div className="lg:sticky lg:top-24 h-fit">
            <ImageWithFallback
              src={drink.image}
              alt={drink.name}
              className="w-full h-64 lg:h-96 object-cover rounded-lg mb-4"
            />
            <h2 style={{ color: '#000500' }} className="mb-2">{drink.name}</h2>
            <p style={{ color: 'rgba(0, 5, 0, 0.7)' }} className="mb-4">{drink.description}</p>
            <div className="rounded-lg p-4" style={{
              backgroundColor: 'rgba(214, 0, 0, 0.1)',
              border: '1px solid rgba(214, 0, 0, 0.3)'
            }}>
              <div className="flex items-center justify-between">
                <span style={{ color: '#000500' }}>Current Price</span>
                <span style={{ color: '#d60000' }}>${calculatePrice().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Right Column - Customization Options */}
          <div className="space-y-6 pb-24 lg:pb-8">
            {/* Size */}
            {!isSnack && (
            <div>
              <label className="block text-gray-900 mb-3">Size</label>
              <div className="grid grid-cols-3 gap-3">
                {(['Small', 'Medium', 'Large'] as const).map(size => (
                  <button
                    key={size}
                    onClick={() => setCustomization(prev => ({ ...prev, size }))}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      customization.size === size ? selectedClass : unselectedClass
                    }`}
                  >
                    <div className="text-center">
                      <div className="mb-1">{size}</div>
                      <div className="text-xs text-gray-500">
                        {size === 'Small' ? '+$0.00' : size === 'Medium' ? '+$0.50' : '+$1.00'}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            )}

            {/* Milk */}
            {!isSnack && (
            <div>
              <label className="block text-gray-900 mb-3">Milk</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {milkOptions.map(milk => (
                  <button
                    key={milk}
                    onClick={() => setCustomization(prev => ({ ...prev, milk }))}
                    className={`p-3 rounded-lg border-2 transition-all text-sm ${
                      customization.milk === milk ? selectedClass : unselectedClass
                    }`}
                  >
                    {milk}
                  </button>
                ))}
              </div>
            </div>
            )}

            {/* Sweetness */}
            {!isSnack && (
            <div>
              <label className="block text-gray-900 mb-3">
                Sweetness: {customization.sweetness}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="25"
                value={customization.sweetness}
                onChange={(e) => setCustomization(prev => ({ ...prev, sweetness: parseInt(e.target.value) }))}
                className="w-full accent-red-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>
            )}

            {/* Ice */}
            {!isSnack && (
            <div>
              <label className="block text-gray-900 mb-3">Ice</label>
              <div className="grid grid-cols-2 gap-2">
                {(['No Ice', 'Less Ice', 'Regular Ice', 'Extra Ice'] as const).map(ice => (
                  <button
                    key={ice}
                    onClick={() => setCustomization(prev => ({ ...prev, ice }))}
                    className={`p-3 rounded-lg border-2 transition-all text-sm ${
                      customization.ice === ice ? selectedClass : unselectedClass
                    }`}
                  >
                    {ice}
                  </button>
                ))}
              </div>
            </div>
            )}

            {/* Extras */}
            {!isSnack && (
            <div>
              <label className="block text-gray-900 mb-3">Extras (+$0.50 each)</label>
              <div className="space-y-2">
                {extraOptions.map(extra => (
                  <button
                    key={extra}
                    onClick={() => toggleExtra(extra)}
                    className={`w-full p-3 rounded-lg border-2 transition-all flex items-center justify-between ${
                      customization.extras.includes(extra) ? selectedClass : unselectedClass
                    }`}
                  >
                    <span>{extra}</span>
                    {customization.extras.includes(extra) ? (
                      <Minus className="w-5 h-5" />
                    ) : (
                      <Plus className="w-5 h-5" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            )}

            {/* Temperature */}
            <div>
              <label className="block text-gray-900 mb-3">{isSnack ? 'Heating Preference' : 'Temperature'}</label>
              <div className="grid grid-cols-2 gap-2">
                {isSnack ? (
                  <>
                    <button
                      onClick={() => setCustomization(prev => ({ ...prev, temperature: 'Hot' }))}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        customization.temperature === 'Hot' ? selectedClass : unselectedClass
                      }`}
                    >
                      Heat Up
                    </button>
                    <button
                      onClick={() => setCustomization(prev => ({ ...prev, temperature: 'Iced' }))}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        customization.temperature === 'Iced' ? selectedClass : unselectedClass
                      }`}
                    >
                      No Heating
                    </button>
                  </>
                ) : (
                  <>
                    {(['Hot', 'Iced'] as const).map(temp => (
                      <button
                        key={temp}
                        onClick={() => setCustomization(prev => ({ ...prev, temperature: temp }))}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          customization.temperature === temp ? selectedClass : unselectedClass
                        }`}
                      >
                        {temp}
                      </button>
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* Coffee Strength */}
            {!isSnack && (
            <div>
              <label className="block text-gray-900 mb-3">Coffee Strength</label>
              <div className="grid grid-cols-3 gap-2">
                {coffeeStrengthOptions.map(strength => (
                  <button
                    key={strength}
                    onClick={() => setCustomization(prev => ({ ...prev, coffeeStrength: strength }))}
                    className={`p-3 rounded-lg border-2 transition-all text-sm ${
                      customization.coffeeStrength === strength ? selectedClass : unselectedClass
                    }`}
                  >
                    {strength}
                  </button>
                ))}
              </div>
            </div>
            )}

            {/* Flavor */}
            {!isSnack && (
            <div>
              <label className="block text-gray-900 mb-3">Flavor</label>
              <div className="grid grid-cols-2 gap-2">
                {flavorOptions.map(flavor => (
                  <button
                    key={flavor}
                    onClick={() => setCustomization(prev => ({ ...prev, flavor }))}
                    className={`p-3 rounded-lg border-2 transition-all text-sm ${
                      customization.flavor === flavor ? selectedClass : unselectedClass
                    }`}
                  >
                    {flavor}
                  </button>
                ))}
              </div>
            </div>
            )}

            {/* Topping */}
            {!isSnack && (
            <div>
              <label className="block text-gray-900 mb-3">Topping</label>
              <div className="grid grid-cols-2 gap-2">
                {toppingOptions.map(topping => (
                  <button
                    key={topping}
                    onClick={() => setCustomization(prev => ({ ...prev, topping }))}
                    className={`p-3 rounded-lg border-2 transition-all text-sm ${
                      customization.topping === topping ? selectedClass : unselectedClass
                    }`}
                  >
                    {topping}
                  </button>
                ))}
              </div>
            </div>
            )}

            {/* Drizzle */}
            {!isSnack && (
            <div>
              <label className="block text-gray-900 mb-3">Drizzle</label>
              <div className="grid grid-cols-2 gap-2">
                {drizzleOptions.map(drizzle => (
                  <button
                    key={drizzle}
                    onClick={() => setCustomization(prev => ({ ...prev, drizzle }))}
                    className={`p-3 rounded-lg border-2 transition-all text-sm ${
                      customization.drizzle === drizzle ? selectedClass : unselectedClass
                    }`}
                  >
                    {drizzle}
                  </button>
                ))}
              </div>
            </div>
            )}
          </div>
        </div>
      </div>

      {/* Add to Cart Button */}
      <div className="fixed bottom-0 left-0 right-0 border-t p-4 lg:p-6" style={{
        backgroundColor: '#fafaff',
        borderColor: 'rgba(0, 5, 0, 0.1)'
      }}>
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => onAddToCart(customization)}
            className="w-full py-4 rounded-lg transition-colors flex items-center justify-between px-6"
            style={{
              backgroundColor: '#000500',
              color: '#fafaff'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#540000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#000500';
            }}
          >
            <span>Add to Cart</span>
            <span>${calculatePrice().toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}