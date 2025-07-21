import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, TextInput, Alert } from 'react-native';
import { TrendingUp, Package, Plus, Trash2 } from 'lucide-react-native';
import { Header } from './Header';
import { useEffect, useState, useRef, createRef } from 'react';
import { getSales, addSale } from '../dbService';
import { LinearGradient } from 'expo-linear-gradient';
import { DatePicker } from './DatePicker';
import { Dropdown } from './Dropdown';
import { COLORS, PAYMENT_MODES } from '../constants';

interface SaleItem {
  id: string;
  productName: string;
  price: string;
  quantity: string;
}

export default function Sales() {
  const [sales, setSales] = useState<any[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [saleDate, setSaleDate] = useState(new Date());
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [paidAmount, setPaidAmount] = useState('');
  const [discount, setDiscount] = useState('');
  const [tax, setTax] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<SaleItem[]>(
    Array.from({ length: 5 }, (_, i) => ({
      id: (i + 1).toString(),
      productName: '',
      price: '',
      quantity: '',
    }))
  );
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Create refs for input fields
  const inputRefs = useRef<any[]>(Array(items.length * 3).fill(null));

  // Add 5 more rows if user focuses on last row
  const handleItemInputFocus = (index: number) => {
    if (items.length - index <= 1) {
      const newItems = Array.from({ length: 5 }, (_, i) => ({
        id: (Date.now() + i).toString(),
        productName: '',
        price: '',
        quantity: '',
      }));
      
      setItems(prev => ([...prev, ...newItems]));
      
      // Update refs array size
      inputRefs.current = [...inputRefs.current, ...Array(15).fill(null)];
    }
  };

  const addNewItem = () => {
    const newItem: SaleItem = {
      id: Date.now().toString(),
      productName: '',
      price: '',
      quantity: '',
    };
    setItems([...items, newItem]);
    // Update refs array size
    inputRefs.current = [...inputRefs.current, null, null, null];
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      const index = items.findIndex(item => item.id === id);
      if (index !== -1) {
        // Remove the item
        const newItems = items.filter(item => item.id !== id);
        setItems(newItems);
        
        // Rebuild the refs array
        const newRefs = Array(newItems.length * 3).fill(null);
        inputRefs.current = newRefs;
      }
    }
  };

  const updateItem = (id: string, field: keyof SaleItem, value: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
    // Clear field-specific errors when user starts typing
    if (errors[`${field}_${items.findIndex(item => item.id === id)}`]) {
      const newErrors = { ...errors };
      delete newErrors[`${field}_${items.findIndex(item => item.id === id)}`];
      setErrors(newErrors);
    }
  };

  const calculateSubtotal = () => {
    return items.reduce((total, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.price) || 0;
      return total + (quantity * price);
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = parseFloat(discount) || 0;
    const taxAmount = parseFloat(tax) || 0;
    return subtotal - discountAmount + taxAmount;
  };

  const fetchSales = async () => {
    try {
      const data = await getSales();
      setSales(data);
    } catch (error) {
      console.error('Error fetching sales:', error);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Completed': return '#10B981';
      case 'Pending': return '#F59E0B';
      case 'Cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }

    // Validate payment mode
    if (!paymentMode) {
      newErrors.paymentMode = 'Payment mode is required';
    }
    
    // Validate paid amount
    if (!paidAmount.trim()) {
      newErrors.paidAmount = 'Paid Amount is required';
    } else if (isNaN(parseFloat(paidAmount)) || parseFloat(paidAmount) < 0) {
      newErrors.paidAmount = 'Paid Amount must be a valid number';
    }

    // Only validate items that have at least one field filled
    items.forEach((item, index) => {
      // Check if this item has any data entered
      const hasData = item.productName.trim() || item.quantity.trim() || item.price.trim();
      
      if (hasData) {
        if (!item.productName.trim()) {
          newErrors[`productName_${index}`] = 'Product name is required';
        }
        if (!item.quantity.trim()) {
          newErrors[`quantity_${index}`] = 'Quantity is required';
        } else if (parseFloat(item.quantity) <= 0) {
          newErrors[`quantity_${index}`] = 'Quantity must be greater than 0';
        }
        if (!item.price.trim()) {
          newErrors[`price_${index}`] = 'Price is required';
        } else if (parseFloat(item.price) <= 0) {
          newErrors[`price_${index}`] = 'Price must be greater than 0';
        }
      }
    });

    setErrors(newErrors);
    console.log('Validation errors:', newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    console.log('Submitting with items:', items);
    const filteredItems = items.filter(item => item.productName.trim() || item.quantity.trim() || item.price.trim());
    console.log('Filtered items:', filteredItems);
    
    if (validateForm()) {
      setIsSubmitting(true);
      const totalAmount = calculateTotal();
      const paidAmountValue = parseFloat(paidAmount) || 0;
      
      try {
        await addSale({
          orderId: 'ORD-' + Date.now(),
          customerId: '',
          customerName,
          customerPhone,
          customerEmail,
          subtotal: calculateSubtotal(),
          discount: parseFloat(discount) || 0,
          tax: parseFloat(tax) || 0,
          totalAmount,
          paidAmount: paidAmountValue,
          balanceAmount: totalAmount - paidAmountValue,
          paymentMode,
          status: paidAmountValue >= totalAmount ? 'Completed' : 'Pending',
          saleDate,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: '',
          notes,
          items: items.filter(item => item.productName.trim() || item.quantity.trim() || item.price.trim()).map(item => ({
            productId: '',
            productName: item.productName,
            sku: '',
            quantity: parseFloat(item.quantity) || 0,
            unitPrice: parseFloat(item.price) || 0,
            discount: 0,
            totalPrice: (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0)
          }))
        });
        
        setIsSubmitting(false);
        Alert.alert(
          'Sale Recorded Successfully! ✅',
          `Total sale of ₹${totalAmount.toFixed(2)} has been recorded.`,
          [{ 
            text: 'OK', 
            onPress: () => {
              // Reset form
              setCustomerName('');
              setCustomerPhone('');
              setCustomerEmail('');
              setSaleDate(new Date());
              setPaymentMode('Cash');
              setPaidAmount('');
              setDiscount('');
              setTax('');
              setNotes('');
              setItems(Array.from({ length: 5 }, (_, i) => ({
                id: (i + 1).toString(),
                productName: '',
                price: '',
                quantity: '',
              })));
              setErrors({});
              fetchSales();
            }
          }]
        );
      } catch (error) {
        setIsSubmitting(false);
        Alert.alert('Error', 'Failed to record sale');
      }
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Sale',
      'Are you sure you want to cancel this sale? All data will be lost.',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: () => {
          setCustomerName('');
          setCustomerPhone('');
          setCustomerEmail('');
          setSaleDate(new Date());
          setPaymentMode('Cash');
          setPaidAmount('');
          setDiscount('');
          setTax('');
          setNotes('');
          setItems(Array.from({ length: 5 }, (_, i) => ({
            id: (i + 1).toString(),
            productName: '',
            price: '',
            quantity: '',
          })));
          setErrors({});
        }}
      ]
    );
  };

  const todaySales = sales.filter((s: any) => {
    const d = new Date(s.saleDate);
    const now = new Date();
    return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const todayTotal: number = todaySales.reduce((sum: number, s: any) => sum + (Number(s.totalAmount) || 0), 0);

  return (
    <View style={styles.container}>
      <Header title="Sales" subtitle="Manage your sales and orders" />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Section */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { borderLeftColor: '#3B82F6' }]}> 
            <TrendingUp size={24} color="#3B82F6" />
            <Text style={styles.statValue}>₹{todayTotal.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Today's Sales</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: '#10B981' }]}> 
            <Package size={24} color="#10B981" />
            <Text style={styles.statValue}>{todaySales.length}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
        </View>

        {/* New Sale Form */}
        <LinearGradient colors={['#1E40AF', '#3B82F6']} style={styles.headerGradient}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>New Sale</Text>
            <Text style={styles.headerSubtitle}>Record new sales transaction</Text>
          </View>
        </LinearGradient>

        {/* Customer Information */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          
          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Customer Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.customerName && styles.inputError]}
                placeholder="Enter customer name"
                value={customerName}
                onChangeText={(text) => {
                  setCustomerName(text);
                  if (errors.customerName) {
                    const newErrors = { ...errors };
                    delete newErrors.customerName;
                    setErrors(newErrors);
                  }
                }}
              />
              {errors.customerName && (
                <Text style={styles.errorText}>{errors.customerName}</Text>
              )}
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter phone number"
                value={customerPhone}
                onChangeText={setCustomerPhone}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter email address"
                value={customerEmail}
                onChangeText={setCustomerEmail}
                keyboardType="email-address"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Sale Date</Text>
              <DatePicker
                date={saleDate}
                onDateChange={date => setSaleDate(date ?? new Date())}
                style={styles.input}
              />
            </View>
          </View>
        </View>

        {/* Items Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Items</Text>
            <TouchableOpacity onPress={addNewItem} style={styles.addButton}>
              <Plus size={16} color="#3B82F6" />
              <Text style={styles.addButtonText}>Add Item</Text>
            </TouchableOpacity>
          </View>
          
          {items.map((item, index) => (
            <View key={item.id} style={styles.itemCard}>
              <Text style={styles.itemNumber}>Item #{index + 1}</Text>
              <View style={styles.itemRow}>
                <View style={styles.itemInputContainer}>
                  <Text style={styles.label}>
                    Product <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    ref={el => { inputRefs.current[index * 3] = el; }}
                    style={[styles.input, errors[`productName_${index}`] && styles.inputError]}
                    placeholder="Product name"
                    value={item.productName}
                    onChangeText={(value) => updateItem(item.id, 'productName', value)}
                    onFocus={() => handleItemInputFocus(index)}
                    returnKeyType="next"
                    onSubmitEditing={() => inputRefs.current[index * 3 + 1]?.focus()}
                  />
                  {errors[`productName_${index}`] && (
                    <Text style={styles.errorText}>{errors[`productName_${index}`]}</Text>
                  )}
                </View>

                <View style={styles.itemInputContainer}>
                  <Text style={styles.label}>
                    Price <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    ref={el => { inputRefs.current[index * 3 + 1] = el; }}
                    style={[styles.input, errors[`price_${index}`] && styles.inputError]}
                    placeholder="0.00"
                    value={item.price}
                    onChangeText={(value) => updateItem(item.id, 'price', value)}
                    keyboardType="numeric"
                    onFocus={() => handleItemInputFocus(index)}
                    returnKeyType="next"
                    onSubmitEditing={() => inputRefs.current[index * 3 + 2]?.focus()}
                  />
                  {errors[`price_${index}`] && (
                    <Text style={styles.errorText}>{errors[`price_${index}`]}</Text>
                  )}
                </View>

                <View style={styles.itemInputContainer}>
                  <Text style={styles.label}>
                    Quantity <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    ref={el => { inputRefs.current[index * 3 + 2] = el; }}
                    style={[styles.input, errors[`quantity_${index}`] && styles.inputError]}
                    placeholder="1"
                    value={item.quantity}
                    onChangeText={(value) => updateItem(item.id, 'quantity', value)}
                    keyboardType="numeric"
                    onFocus={() => handleItemInputFocus(index)}
                    returnKeyType={index < items.slice(0, 5).length - 1 ? "next" : "done"}
                    onSubmitEditing={() => {
                      // Move to next item's product name input, not delete button
                      if (index < items.slice(0, 5).length - 1) {
                        inputRefs.current[(index + 1) * 3]?.focus();
                      }
                    }}
                  />
                  {errors[`quantity_${index}`] && (
                    <Text style={styles.errorText}>{errors[`quantity_${index}`]}</Text>
                  )}
                </View>

                <TouchableOpacity
                  onPress={() => removeItem(item.id)}
                  style={styles.deleteButton}
                  accessibilityRole="button"
                  importantForAccessibility="no"
                  {...(Platform.OS === 'web' ? { tabIndex: -1 } : {})}
                >
                  <Trash2 size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>

              {/* Item Total */}
              {item.quantity && item.price && (
                <View style={styles.itemTotal}>
                  <Text style={styles.itemTotalLabel}>Item Total:</Text>
                  <Text style={styles.itemTotalValue}>
                    ₹{(parseFloat(item.quantity) * parseFloat(item.price)).toFixed(2)}
                  </Text>
                </View>
              )}
            </View>
          ))}

          <TouchableOpacity style={styles.addItemButton} onPress={() => {
            const newItem = {
              id: Date.now().toString(),
              productName: '',
              price: '',
              quantity: '',
            };
            setItems([...items, newItem]);
            inputRefs.current = [...inputRefs.current, null, null, null];
          }}>
            <Plus size={20} color="#3B82F6" />
            <Text style={styles.addItemText}>Add Another Item</Text>
          </TouchableOpacity>

          {/* Payment Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Details</Text>
            
            <View style={styles.row}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Discount (₹)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  value={discount}
                  onChangeText={setDiscount}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Tax (₹)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  value={tax}
                  onChangeText={setTax}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Payment Mode <Text style={styles.required}>*</Text></Text>
                <Dropdown
                  options={PAYMENT_MODES}
                  selectedValue={paymentMode}
                  onValueChange={(value) => {
                    setPaymentMode(value);
                    if (errors.paymentMode) {
                      const newErrors = { ...errors };
                      delete newErrors.paymentMode;
                      setErrors(newErrors);
                    }
                  }}
                  style={[styles.input, errors.paymentMode && styles.inputError]}
                />
                {errors.paymentMode && (
                  <Text style={styles.errorText}>{errors.paymentMode}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  Paid Amount (₹) <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, errors.paidAmount && styles.inputError]}
                  placeholder="0.00"
                  value={paidAmount}
                  onChangeText={(text) => {
                    setPaidAmount(text);
                    if (errors.paidAmount) {
                      const newErrors = { ...errors };
                      delete newErrors.paidAmount;
                      setErrors(newErrors);
                    }
                  }}
                  keyboardType="numeric"
                />
                {errors.paidAmount && (
                  <Text style={styles.errorText}>{errors.paidAmount}</Text>
                )}
              </View>
            </View>

            {/* Notes section commented out
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Additional notes about this sale..."
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
            */}
          </View>
        </View>

        {/* Total Section */}
        <LinearGradient colors={['#F8FAFC', '#EBF8FF']} style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.subtotalAmount}>₹{calculateSubtotal().toFixed(2)}</Text>
          </View>
          
          {parseFloat(discount) > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Discount:</Text>
              <Text style={styles.discountAmount}>-₹{parseFloat(discount).toFixed(2)}</Text>
            </View>
          )}
          
          {parseFloat(tax) > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax:</Text>
              <Text style={styles.taxAmount}>+₹{parseFloat(tax).toFixed(2)}</Text>
            </View>
          )}
          
          <View style={[styles.totalRow, styles.finalRow]}>
            <Text style={styles.grandTotalLabel}>Total Amount:</Text>
            <Text style={styles.grandTotalAmount}>₹{calculateTotal().toFixed(2)}</Text>
          </View>
          
          {paidAmount && (
            <View style={styles.totalRow}>
              <Text style={styles.balanceLabel}>
                {parseFloat(paidAmount) >= calculateTotal() ? 'Change:' : 'Balance Due:'}
              </Text>
              <Text style={[
                styles.balanceAmount,
                { color: parseFloat(paidAmount) >= calculateTotal() ? '#10B981' : '#EF4444' }
              ]}>
                ₹{Math.abs(calculateTotal() - parseFloat(paidAmount || '0')).toFixed(2)}
              </Text>
            </View>
          )}
        </LinearGradient>

        {/* Action Buttons */}
        <View style={{
          flexDirection: 'row',
          gap: 12,
          marginBottom: 30,
        }}>
          <TouchableOpacity 
            style={{
              flex: 1,
              backgroundColor: 'white',
              borderWidth: 1,
              borderColor: '#D1D5DB',
              borderRadius: 12,
              padding: 16,
              alignItems: 'center',
            }} 
            onPress={handleCancel}
          >
            <Text style={{
              fontSize: 16,
              fontFamily: 'Inter-Medium',
              color: '#6B7280',
            }}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              {
                flex: 2,
                borderRadius: 12,
                overflow: 'hidden',
              }, 
              isSubmitting && { opacity: 0.7 }
            ]} 
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <LinearGradient 
              colors={isSubmitting ? ['#9CA3AF', '#6B7280'] : ['#3B82F6', '#1E40AF']} 
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                padding: 16,
              }}
            >
              <Text style={{
                fontSize: 16,
                fontFamily: 'Inter-SemiBold',
                color: 'white',
              }}>
                {isSubmitting ? 'Processing...' : 'Complete Sale'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Recent Orders Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          <View style={styles.ordersContainer}>
            {sales.slice(0, 5).map((order) => (
              <TouchableOpacity key={order.id} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderId}>{order.orderId}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '15' }]}> 
                    <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}> 
                      {order.status}
                    </Text>
                  </View>
                </View>
                <Text style={styles.customerName}>{order.customerName}</Text>
                <View style={styles.orderFooter}>
                  <Text style={styles.orderAmount}>₹{Number(order.totalAmount).toLocaleString()}</Text>
                  <Text style={styles.orderDate}>{order.saleDate ? new Date(order.saleDate).toLocaleDateString() : ''}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  headerGradient: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.8)',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  formSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  row: {
    flexDirection: 'column',
    gap: 16,
  },
  itemRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  inputContainer: {
    flex: 1,
    marginBottom: 16,
  },
  itemInputContainer: {
    flex: 1,
    marginBottom: 8,
    minWidth: Platform.OS === 'web' ? '20%' : '30%',
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    marginBottom: 8,
  },
  required: {
    color: '#EF4444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    backgroundColor: 'white',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#EF4444',
    marginTop: 4,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF8FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  addButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
  },
  itemCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  itemNumber: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  itemTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
    alignSelf: 'center',
  },
  itemTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  itemTotalLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  itemTotalValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#3B82F6',
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 20,
    gap: 8,
    marginBottom: 24,
  },
  addItemText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
  },
  totalSection: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  finalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#4B5563',
  },
  subtotalAmount: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#4B5563',
  },
  discountAmount: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
  },
  taxAmount: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#4B5563',
  },
  grandTotalLabel: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  grandTotalAmount: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1E40AF',
  },
  balanceLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  balanceAmount: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  ordersContainer: {
    gap: 12,
  },
  orderCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  customerName: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 12,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderAmount: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
  },
  orderDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
});