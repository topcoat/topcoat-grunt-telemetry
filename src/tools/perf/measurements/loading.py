# Copyright (c) 2012 The Chromium Authors. All rights reserved.
# Use of this source code is governed by a BSD-style license that can be
# found in the LICENSE file.

import collections

from telemetry.core import util
from telemetry.page import page_measurement

class Loading(page_measurement.PageMeasurement):
  @property
  def results_are_the_same_on_every_page(self):
    return False

  def WillNavigateToPage(self, page, tab):
    tab.StartTimelineRecording()

  def MeasurePage(self, page, tab, results):
    # In current telemetry tests, all tests wait for DocumentComplete state,
    # but we need to wait for the load event.
    def IsLoaded():
      return bool(tab.EvaluateJavaScript('performance.timing.loadEventStart'))
    util.WaitFor(IsLoaded, 300)

    # TODO(nduca): when crbug.com/168431 is fixed, modify the page sets to
    # recognize loading as a toplevel action.
    tab.StopTimelineRecording()

    results.Add('UserAgent', '', tab.EvaluateJavaScript('navigator.userAgent'));
    load_timings = tab.EvaluateJavaScript('window.performance.timing')
    load_time_ms = (
      float(load_timings['loadEventStart']) -
      load_timings['navigationStart'])
    dom_content_loaded_time_ms = (
      float(load_timings['domContentLoadedEventStart']) -
      load_timings['navigationStart'])
    results.Add('load_time', 'ms', load_time_ms)
    results.Add('dom_content_loaded_time', 'ms',
                dom_content_loaded_time_ms)

    events = tab.timeline_model.GetAllEvents()

    events_by_name = collections.defaultdict(list)
    for e in events:
      events_by_name[e.name].append(e)

    for key, group in events_by_name.items():
      times = [e.self_time for e in group]
      total = sum(times)
      biggest_jank = max(times)
      results.Add(key, 'ms', total)
      results.Add(key + '_max', 'ms', biggest_jank)
      results.Add(key + '_avg', 'ms', total / len(times))
