import { useState, useEffect } from 'react'

function App() {
	const [array, setArray] = useState<number[]>([])
	const [sorting, setSorting] = useState(false)
	const [sortType, setSortType] = useState<'quick' | 'merge' | 'heap' | 'bubble'>('quick') // Added 'heap'
	const [sortingSpeed, setSortingSpeed] = useState<number>(50)

	useEffect(() => {
		generateRandomArray()
	}, [])

	const generateRandomArray = () => {
		const newArray = Array.from({ length: 100 }, () => Math.floor(Math.random() * 99) + 1)
		setArray(newArray)
	}

	const quickSort = async (arr: number[], low: number, high: number) => {
		if (low < high) {
			const pivotIndex = await partition(arr, low, high)
			await quickSort(arr, low, pivotIndex - 1)
			await quickSort(arr, pivotIndex + 1, high)
		}
	}

	const partition = async (arr: number[], low: number, high: number) => {
		const pivot = arr[high]
		let i = low - 1

		for (let j = low; j < high; j++) {
			if (arr[j] < pivot) {
				i++
				;[arr[i], arr[j]] = [arr[j], arr[i]]
				setArray([...arr])
				await new Promise(resolve => setTimeout(resolve, sortingSpeed))
			}
		}

		;[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]
		setArray([...arr])
		await new Promise(resolve => setTimeout(resolve, sortingSpeed))

		return i + 1
	}

	const mergeSort = async (arr: number[], start: number, end: number) => {
		console.log(start, end)
		if (start < end) {
			const mid = Math.floor((start + end) / 2)
			await mergeSort(arr, start, mid)
			await mergeSort(arr, mid + 1, end)
			await merge(arr, start, mid, end)
		}
	}

	const merge = async (arr: number[], start: number, mid: number, end: number) => {
		const leftArr = arr.slice(start, mid + 1)
		const rightArr = arr.slice(mid + 1, end + 1)
		let i = 0,
			j = 0,
			k = start

		while (i < leftArr.length && j < rightArr.length) {
			if (leftArr[i] <= rightArr[j]) {
				arr[k] = leftArr[i]
				i++
			} else {
				arr[k] = rightArr[j]
				j++
			}
			k++
			setArray([...arr])
			await new Promise(resolve => setTimeout(resolve, sortingSpeed))
		}

		while (i < leftArr.length) {
			arr[k] = leftArr[i]
			i++
			k++
			setArray([...arr])
			await new Promise(resolve => setTimeout(resolve, sortingSpeed))
		}

		while (j < rightArr.length) {
			arr[k] = rightArr[j]
			j++
			k++
			setArray([...arr])
			await new Promise(resolve => setTimeout(resolve, sortingSpeed))
		}
	}

	const bubbleSort = async (arr: number[]) => {
		let n = arr.length
		for (let i = 0; i < n - 1; i++) {
			for (let j = 0; j < n - i - 1; j++) {
				if (arr[j] > arr[j + 1]) {
					;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
					setArray([...arr])
					await new Promise(resolve => setTimeout(resolve, sortingSpeed))
				}
			}
		}
	}

	const heapSort = async (arr: number[]) => {
		let n = arr.length

		const heapify = async (arr: number[], n: number, i: number) => {
			let largest = i
			let left = 2 * i + 1
			let right = 2 * i + 2

			if (left < n && arr[left] > arr[largest]) {
				largest = left
			}

			if (right < n && arr[right] > arr[largest]) {
				largest = right
			}

			if (largest !== i) {
				;[arr[i], arr[largest]] = [arr[largest], arr[i]]
				setArray([...arr])
				await new Promise(resolve => setTimeout(resolve, sortingSpeed))
				await heapify(arr, n, largest)
			}
		}

		for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
			await heapify(arr, n, i)
		}

		for (let i = n - 1; i > 0; i--) {
			;[arr[0], arr[i]] = [arr[i], arr[0]]
			setArray([...arr])
			await new Promise(resolve => setTimeout(resolve, sortingSpeed))
			await heapify(arr, i, 0)
		}
	}

	const startSort = async () => {
		setSorting(true)
		if (sortType === 'quick') {
			await quickSort(array, 0, array.length - 1)
		} else if (sortType === 'merge') {
			await mergeSort(array, 0, array.length - 1)
		} else if (sortType === 'bubble') {
			await bubbleSort(array)
		} else {
			await heapSort(array) // Added heap sort
		}
		setSorting(false)
	}

	return (
		<div style={{ textAlign: 'center', padding: '20px' }}>
			<h1>Sorting Visualization</h1>
			<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'end', marginBottom: '20px' }}>
				{array.map((value, index) => (
					<div
						key={index}
						style={{
							height: `${value * 4}px`,
							width: '12px',
							backgroundColor: 'blue',
							margin: '0 1px',
						}}></div>
				))}
			</div>
			<button onClick={generateRandomArray} disabled={sorting}>
				Generate New Array
			</button>
			<select
				value={sortType}
				onChange={e => setSortType(e.target.value as 'quick' | 'merge' | 'heap')} // Added 'heap'
				disabled={sorting}
				style={{ marginLeft: '10px' }}>
				<option value="quick">Quick Sort</option>
				<option value="merge">Merge Sort</option>
				<option value="heap">Heap Sort</option>
				<option value="bubble">Bubble Sort</option>
			</select>
			<button onClick={startSort} disabled={sorting} style={{ marginLeft: '10px' }}>
				Start Sorting
			</button>
			<div style={{ marginTop: '20px' }}>
				<label htmlFor="speed">Sorting Speed: </label>
				<input
					type="range"
					id="speed"
					min="1"
					max="200"
					value={201 - sortingSpeed}
					onChange={e => setSortingSpeed(201 - parseInt(e.target.value))}
					disabled={sorting}
				/>
			</div>
		</div>
	)
}

export default App
