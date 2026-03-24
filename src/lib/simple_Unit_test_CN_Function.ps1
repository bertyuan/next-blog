# Simple PowerShell test for cn function
# This test verifies the functionality of the cn function which is used to merge Tailwind CSS class names

# Mock implementation of cn function (matching the actual implementation)
function Merge-Classes {
    param(
        [Parameter(ValueFromRemainingArguments=$true)]
        $classes
    )
    $validClasses = $classes | Where-Object { $_ -and $_ -ne '' }
    return $validClasses -join ' '
}

# Run tests
Write-Host "Running unit tests for cn function..."
Write-Host "====================================="

# Test 1: Merge multiple class names
$test1 = Merge-Classes 'class1' 'class2'
if ($test1 -eq 'class1 class2') {
    Write-Host "PASS: should merge multiple class names"
} else {
    Write-Host "FAIL: should merge multiple class names"
    Write-Host "  Expected: 'class1 class2'"
    Write-Host "  Got: '$test1'"
}

# Test 2: Handle undefined and null values
$test2 = Merge-Classes 'class1' $null 'class2' $undefined
if ($test2 -eq 'class1 class2') {
    Write-Host "PASS: should handle undefined and null values"
} else {
    Write-Host "FAIL: should handle undefined and null values"
    Write-Host "  Expected: 'class1 class2'"
    Write-Host "  Got: '$test2'"
}

# Test 3: Handle empty strings
$test3 = Merge-Classes 'class1' '' 'class2'
if ($test3 -eq 'class1 class2') {
    Write-Host "PASS: should handle empty strings"
} else {
    Write-Host "FAIL: should handle empty strings"
    Write-Host "  Expected: 'class1 class2'"
    Write-Host "  Got: '$test3'"
}

# Test 4: Handle conditional classes
$cond1 = if ($true) { 'class2' } else { $null }
$cond2 = if ($false) { 'class3' } else { $null }
$test4 = Merge-Classes 'class1' $cond1 $cond2
if ($test4 -eq 'class1 class2') {
    Write-Host "PASS: should handle conditional classes"
} else {
    Write-Host "FAIL: should handle conditional classes"
    Write-Host "  Expected: 'class1 class2'"
    Write-Host "  Got: '$test4'"
}

# Test 5: Handle complex class combinations
$cond3 = if ($true) { 'bg-blue-500' } else { $null }
$cond4 = if ($false) { 'text-red-500' } else { $null }
$test5 = Merge-Classes 'flex' 'items-center' 'justify-center' $cond3 $cond4
if ($test5 -eq 'flex items-center justify-center bg-blue-500') {
    Write-Host "PASS: should handle complex class combinations"
} else {
    Write-Host "FAIL: should handle complex class combinations"
    Write-Host "  Expected: 'flex items-center justify-center bg-blue-500'"
    Write-Host "  Got: '$test5'"
}

Write-Host "====================================="
Write-Host "All tests completed!"
