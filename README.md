# DataProcessPipe
Just Write Rule Expression, Process/Format Your Data through Pipe.

## Design

1. Data Selection

Expression:

* Object, using `.` to get value by key.

* Array, using [start, end] to select element range.

2. Data Format

Expression:

{$column_name: built-in function chain}
{$column_idx: built-in function chain}

Built-in Function:

* Time

ts2date

Timestamp(Milliseconds, seconds) <=> DateTime(date format (moment.js))
...

* Text

sprintf

String Format (sprintf.js)

regexSubstr

Regex SubString

* Number

Calculation

## Example

<pre>
    [
        {"ts": "1536220630383"},
        {"ts": "1536220631383"},
        {"ts": "1536220632383"},
    ]
</pre>

[1, -1] {ts: ts2date YYYYMMDD}

<pre>
[ { ts: '20180906' }, { ts: '20180906' } ]
</pre>


More Example, 


