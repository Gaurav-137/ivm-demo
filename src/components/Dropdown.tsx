import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react-native';

interface DropdownProps {
  options: string[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  style?: any;
  placeholder?: string;
}

export function Dropdown({ options, selectedValue, onValueChange, style, placeholder = "Select option" }: DropdownProps) {
  const [showOptions, setShowOptions] = useState(false);

  const selectOption = (option: string) => {
    onValueChange(option);
    setShowOptions(false);
  };

  return (
    <View>
      <TouchableOpacity 
        style={[styles.dropdownButton, style]} 
        onPress={() => setShowOptions(true)}
      >
        <Text style={[styles.dropdownText, !selectedValue && styles.placeholderText]}>
          {selectedValue || placeholder}
        </Text>
        <ChevronDown size={16} color="#6B7280" />
      </TouchableOpacity>

      <Modal
        visible={showOptions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowOptions(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setShowOptions(false)}
        >
          <View style={styles.optionsContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    option === selectedValue && styles.selectedOption
                  ]}
                  onPress={() => selectOption(option)}
                >
                  <Text style={[
                    styles.optionText,
                    option === selectedValue && styles.selectedOptionText
                  ]}>
                    {option}
                  </Text>
                  {option === selectedValue && (
                    <Check size={16} color="#3B82F6" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    backgroundColor: 'white',
  },
  dropdownText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 20,
    maxHeight: 300,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  selectedOption: {
    backgroundColor: '#EBF8FF',
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  selectedOptionText: {
    color: '#3B82F6',
    fontFamily: 'Inter-Medium',
  },
});