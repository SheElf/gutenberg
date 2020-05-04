/**
 * External dependencies
 */
import { fireEvent, render } from '@testing-library/react';

/**
 * Internal dependencies
 */
import RangeControl from '../';

const getRangeInput = ( container ) =>
	container.querySelector( 'input[type="range"]' );
const getNumberInput = ( container ) =>
	container.querySelector( 'input[type="number"]' );
const getResetButton = ( container ) =>
	container.querySelector( '.components-range-control__reset' );

describe( 'RangeControl', () => {
	describe( '#render()', () => {
		it( 'should trigger change callback with numeric value', () => {
			const onChange = jest.fn();

			const { container } = render(
				<RangeControl onChange={ onChange } />
			);

			const rangeInput = getRangeInput( container );
			const numberInput = getNumberInput( container );

			fireEvent.change( rangeInput, { target: { value: '5' } } );

			fireEvent.change( numberInput, { target: { value: '10' } } );
			fireEvent.blur( numberInput );

			expect( onChange ).toHaveBeenCalledWith( 5 );
			expect( onChange ).toHaveBeenCalledWith( 10 );
		} );

		it( 'should not render with icons, by default', () => {
			const { container } = render(
				<RangeControl
					beforeIcon="format-image"
					afterIcon="format-video"
				/>
			);

			const icon = container.querySelector( '.dashicons' );

			expect( icon ).toBeFalsy();
		} );

		it( 'should render with icons', () => {
			const { container } = render(
				<RangeControl
					beforeIcon="format-image"
					afterIcon="format-video"
				/>
			);

			const beforeIcon = container.querySelector(
				'.dashicons-format-image'
			);
			const afterIcon = container.querySelector(
				'.dashicons-format-image'
			);

			expect( beforeIcon ).toBeTruthy();
			expect( afterIcon ).toBeTruthy();
		} );
	} );

	describe( 'validation', () => {
		it( 'should not call onChange if the new value is lower than minimum', () => {
			const onChange = jest.fn();
			const { container } = render(
				<RangeControl onChange={ onChange } min={ 11 } value={ 20 } />
			);

			const rangeInput = getRangeInput( container );
			const numberInput = getNumberInput( container );

			fireEvent.change( numberInput, { target: { value: '10' } } );
			fireEvent.blur( numberInput );

			expect( onChange ).not.toHaveBeenCalled();
			expect( rangeInput.value ).toBe( '20' );
		} );

		it( 'should not call onChange if the new value is greater than maximum', () => {
			const onChange = jest.fn();
			const { container } = render(
				<RangeControl onChange={ onChange } max={ 20 } value={ 10 } />
			);

			const rangeInput = getRangeInput( container );
			const numberInput = getNumberInput( container );

			fireEvent.change( numberInput, { target: { value: '21' } } );
			fireEvent.blur( numberInput );

			expect( onChange ).not.toHaveBeenCalled();
			expect( rangeInput.value ).toBe( '10' );
		} );

		it( 'should call onChange if new value is valid', () => {
			const onChange = jest.fn();
			const { container } = render(
				<RangeControl
					onChange={ onChange }
					min={ 10 }
					max={ 20 }
					value={ 10 }
				/>
			);

			const rangeInput = getRangeInput( container );
			const numberInput = getNumberInput( container );

			fireEvent.change( numberInput, { target: { value: '15' } } );
			fireEvent.blur( numberInput );

			expect( onChange ).toHaveBeenCalledWith( 15 );
			expect( rangeInput.value ).toBe( '15' );
		} );

		it( 'should validate when provided a max or min of zero', () => {
			const onChange = jest.fn();
			const { container } = render(
				<RangeControl
					onChange={ onChange }
					min={ -100 }
					max={ 0 }
					value={ 0 }
				/>
			);

			const rangeInput = getRangeInput( container );
			const numberInput = getNumberInput( container );

			fireEvent.change( numberInput, { target: { value: '1' } } );
			fireEvent.blur( numberInput );

			expect( onChange ).not.toHaveBeenCalled();
			expect( rangeInput.value ).toBe( '0' );
		} );

		it( 'should validate when min and max are negative', () => {
			const onChange = jest.fn();
			const { container } = render(
				<RangeControl
					onChange={ onChange }
					min={ -100 }
					max={ -50 }
					value={ -60 }
				/>
			);

			const rangeInput = getRangeInput( container );
			const numberInput = getNumberInput( container );

			fireEvent.change( numberInput, { target: { value: '-101' } } );
			fireEvent.blur( numberInput );

			expect( onChange ).not.toHaveBeenCalled();
			expect( rangeInput.value ).toBe( '-60' );

			fireEvent.change( numberInput, { target: { value: '-49' } } );
			fireEvent.blur( numberInput );

			expect( onChange ).not.toHaveBeenCalled();
			expect( rangeInput.value ).toBe( '-60' );

			fireEvent.change( numberInput, { target: { value: '-50' } } );
			fireEvent.blur( numberInput );

			expect( onChange ).toHaveBeenCalledWith( -50 );
			expect( rangeInput.value ).toBe( '-50' );
		} );

		it( 'should take into account the step starting from min', () => {
			const onChange = jest.fn();
			const { container } = render(
				<RangeControl
					onChange={ onChange }
					min={ 0.1 }
					step={ 0.125 }
					value={ 0.1 }
				/>
			);

			const rangeInput = getRangeInput( container );
			const numberInput = getNumberInput( container );

			fireEvent.change( numberInput, { target: { value: '0.125' } } );
			fireEvent.blur( numberInput );

			expect( onChange ).not.toHaveBeenCalled();
			expect( rangeInput.value ).toBe( '0.1' );

			fireEvent.change( numberInput, { target: { value: '0.225' } } );
			fireEvent.blur( numberInput );

			expect( onChange ).toHaveBeenCalledWith( 0.225 );
			expect( rangeInput.value ).toBe( '0.225' );
		} );
	} );

	describe( 'initialPosition / value', () => {
		it( 'should render initial rendered value of 50% of min/max, if no initialPosition or value is defined', () => {
			const { container } = render(
				<RangeControl min={ 0 } max={ 10 } />
			);

			const rangeInput = getRangeInput( container );

			expect( rangeInput.value ).toBe( '5' );
		} );

		it( 'should render initialPosition if no value is provided', () => {
			const { container } = render(
				<RangeControl initialPosition={ 50 } />
			);

			const rangeInput = getRangeInput( container );

			expect( rangeInput.value ).toBe( '50' );
		} );

		it( 'should render value instead of initialPosition is provided', () => {
			const { container } = render(
				<RangeControl initialPosition={ 50 } value={ 10 } />
			);

			const rangeInput = getRangeInput( container );

			expect( rangeInput.value ).toBe( '10' );
		} );
	} );

	describe( 'input field', () => {
		it( 'should render an input field by default', () => {
			const { container } = render( <RangeControl /> );

			const numberInput = getNumberInput( container );

			expect( numberInput ).toBeTruthy();
		} );

		it( 'should not render an input field, if disabled', () => {
			const { container } = render(
				<RangeControl withInputField={ false } />
			);

			const numberInput = getNumberInput( container );

			expect( numberInput ).toBeFalsy();
		} );

		it( 'should render a zero value into input range and field', () => {
			const { container } = render( <RangeControl value={ 0 } /> );

			const rangeInput = getRangeInput( container );
			const numberInput = getNumberInput( container );

			expect( rangeInput.value ).toBe( '0' );
			expect( numberInput.value ).toBe( '0' );
		} );

		it( 'should update both field and range on change', () => {
			const { container } = render( <RangeControl value={ 0 } /> );

			const rangeInput = getRangeInput( container );
			const numberInput = getNumberInput( container );

			fireEvent.change( rangeInput, { target: { value: 13 } } );

			expect( rangeInput.value ).toBe( '13' );
			expect( numberInput.value ).toBe( '13' );

			fireEvent.change( numberInput, { target: { value: 7 } } );
			fireEvent.blur( numberInput );

			expect( rangeInput.value ).toBe( '7' );
			expect( numberInput.value ).toBe( '7' );
		} );

		it( 'should reset input values if next value is removed', () => {
			const { container } = render( <RangeControl value={ 13 } /> );

			const rangeInput = getRangeInput( container );
			const numberInput = getNumberInput( container );

			expect( rangeInput.value ).toBe( '13' );
			expect( numberInput.value ).toBe( '13' );

			fireEvent.change( numberInput, { target: { value: '' } } );
			fireEvent.blur( numberInput );

			// Reset to 50. Median value of min: 0, max: 100
			expect( rangeInput.value ).toBe( '50' );
			// Input field should be blank
			expect( numberInput.value ).toBe( '' );
		} );
	} );

	describe( 'reset', () => {
		it( 'should reset to a custom fallback value, defined by a parent component', () => {
			const { container } = render(
				<RangeControl
					initialPosition={ 50 }
					value={ 10 }
					allowReset={ true }
					resetFallbackValue={ 33 }
				/>
			);

			const resetButton = getResetButton( container );
			const rangeInput = getRangeInput( container );
			const numberInput = getNumberInput( container );

			fireEvent.click( resetButton );

			expect( rangeInput.value ).toBe( '33' );
			expect( numberInput.value ).toBe( '33' );
		} );

		it( 'should reset to a 50% of min/max value, of no initialPosition or value is defined', () => {
			const { container } = render(
				<RangeControl
					initialPosition={ undefined }
					value={ 10 }
					min={ 0 }
					max={ 100 }
					allowReset={ true }
					resetFallbackValue={ undefined }
				/>
			);

			const resetButton = getResetButton( container );
			const rangeInput = getRangeInput( container );
			const numberInput = getNumberInput( container );

			fireEvent.click( resetButton );

			expect( rangeInput.value ).toBe( '50' );
			expect( numberInput.value ).toBe( '' );
		} );
	} );
} );
